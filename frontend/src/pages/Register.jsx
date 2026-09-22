import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiErr } from "@/lib/api";
import { Icon } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to SmartLearn.");
      navigate("/app");
    } catch (err) {
      toast.error(apiErr(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden dark">
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md card-surface p-8">
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-ai text-white"><Icon name="graduation-cap" className="h-5 w-5" /></div>
          <span className="font-display text-xl font-extrabold">SmartLearn</span>
        </Link>
        <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">Create your account</h1>
        <p className="text-muted-foreground mb-6">Start learning in under a minute.</p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { v: "student", label: "Student", icon: "graduation-cap" },
            { v: "teacher", label: "Teacher", icon: "presentation" },
          ].map((r) => (
            <button
              key={r.v}
              type="button"
              onClick={() => setForm((f) => ({ ...f, role: r.v }))}
              data-testid={`role-${r.v}`}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-4 transition-colors",
                form.role === r.v ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
              )}
            >
              <Icon name={r.icon} className="h-5 w-5" />
              <span className="text-sm font-medium">{r.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={form.name} onChange={set("name")} required placeholder="Ada Lovelace" className="mt-1.5" data-testid="register-name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" className="mt-1.5" data-testid="register-email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={set("password")} required minLength={6} placeholder="At least 6 characters" className="mt-1.5" data-testid="register-password" />
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading} data-testid="register-submit">
            {loading ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
