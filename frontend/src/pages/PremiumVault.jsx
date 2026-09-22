import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Icon, Loader } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const premiumCategories = [
  { id: "all", label: "All Content", icon: "layout-grid" },
  { id: "ebook", label: "E-Books", icon: "book" },
  { id: "course", label: "Premium Courses", icon: "play-circle" },
  { id: "pdf", label: "PDF Resources", icon: "file-text" },
  { id: "bundle", label: "Bundles", icon: "package" },
];

export default function PremiumVault() {
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCheckout, setShowCheckout] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["premium"],
    queryFn: async () => (await api.get("/premium")).data,
  });

  const { data: libraryData } = useQuery({
    queryKey: ["premium-library"],
    queryFn: async () => (await api.get("/premium/library")).data,
  });

  const handlePurchase = async (item) => {
    try {
      const { data: orderData } = await api.post(`/premium/${item._id}/order`);
      if (orderData.alreadyOwned) {
        toast.success("You already own this content!");
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SmartLearn",
        description: orderData.item.title,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const { data: verifyData } = await api.post(`/premium/${item._id}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyData.verified) {
              toast.success("Payment successful! Content unlocked.");
              qc.invalidateQueries({ queryKey: ["premium"] });
              qc.invalidateQueries({ queryKey: ["premium-library"] });
              setShowCheckout(null);
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#6366F1",
        },
        modal: {
          ondismiss: () => {
            setShowCheckout(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not initiate payment");
    }
  };

  if (isLoading) return <Loader label="Loading premium content…" />;

  const filteredItems =
    selectedCategory === "all"
      ? data?.items || []
      : (data?.items || []).filter((item) => item.type === selectedCategory);

  const ownedItems = libraryData?.items || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-slate-900/50 to-indigo-900/20 border border-purple-500/20 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="crown" className="h-6 w-6 text-yellow-500" />
            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Premium</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Premium Content Vault</h1>
          <p className="text-slate-300 max-w-2xl">
            Unlock exclusive resources, advanced courses, and premium materials to accelerate your learning journey.
          </p>
        </div>
      </div>

      {/* Your Library */}
      {ownedItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Your Library</h2>
            <Badge className="bg-success/10 text-success border-success/20">
              {ownedItems.length} items owned
            </Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-xl border border-success/30 bg-success/5 hover:border-success/50 transition-all"
              >
                <div className="absolute top-3 right-3">
                  <Badge className="bg-success text-white border-0">
                    <Icon name="check" className="h-3 w-3 mr-1" />
                    Owned
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-success">
                      <Icon name="crown" className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full border-success/30 text-success hover:bg-success/10">
                    <Icon name="download" className="h-4 w-4 mr-2" />
                    Access Content
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Premium Store */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">Premium Store</h2>
          <div className="flex flex-wrap gap-2">
            {premiumCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon name={cat.icon} className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="inbox" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No content found in this category</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                {item.unlocked && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-success text-white border-0">
                      <Icon name="check" className="h-3 w-3 mr-1" />
                      Owned
                    </Badge>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {item.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">₹{item.price}</div>
                      <div className="text-xs text-muted-foreground">One-time purchase</div>
                    </div>
                    {item.unlocked ? (
                      <Button size="sm" variant="outline" className="border-success/30 text-success">
                        <Icon name="download" className="h-4 w-4 mr-2" />
                        Access
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handlePurchase(item)}
                        className="bg-gradient-to-r from-primary to-ai hover:from-primary/90 hover:to-ai/90"
                      >
                        <Icon name="lock" className="h-4 w-4 mr-2" />
                        Unlock
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: "shield-check",
            title: "Secure Payments",
            description: "All transactions are secured by Razorpay with bank-grade encryption",
          },
          {
            icon: "refresh-cw",
            title: "Lifetime Access",
            description: "Purchase once, own forever. No subscriptions or hidden fees",
          },
          {
            icon: "headphones",
            title: "Priority Support",
            description: "Get dedicated support for all premium content and resources",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border/50 bg-card/30 p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Icon name={feature.icon} className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}