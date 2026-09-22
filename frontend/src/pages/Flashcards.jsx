import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { PageHeader, Icon, AIBanner, EmptyState, Loader } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Flashcards() {
  const qc = useQueryClient();
  const [topic, setTopic] = useState("");
  const [gen, setGen] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { data: status } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await api.get("/ai/status")).data });
  const { data, isLoading } = useQuery({ queryKey: ["flashcards"], queryFn: async () => (await api.get("/flashcards")).data });
  const { data: due, refetch: refetchDue } = useQuery({ queryKey: ["flashcards-due"], queryFn: async () => (await api.get("/flashcards/due")).data });

  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setGen(true);
    try {
      const { data: res } = await api.post("/ai/flashcards", { topic, count: 8 });
      toast.success(`Generated ${res.cards.length} flashcards!`);
      qc.invalidateQueries({ queryKey: ["flashcards"] });
      qc.invalidateQueries({ queryKey: ["flashcards-due"] });
      setTopic("");
    } catch (_) { toast.error("Generation failed"); }
    finally { setGen(false); }
  };

  const dueCards = due?.cards || [];
  const current = dueCards[idx];

  const review = async (correct) => {
    try {
      await api.post(`/flashcards/${current._id}/review`, { correct });
      setFlipped(false);
      if (idx + 1 >= dueCards.length) {
        toast.success("Review session complete! 🎉");
        setReviewing(false);
        setIdx(0);
        refetchDue();
        qc.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        setIdx((i) => i + 1);
      }
    } catch (_) { toast.error("Failed"); }
  };

  if (reviewing && current) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => { setReviewing(false); setIdx(0); setFlipped(false); }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Icon name="x" className="h-4 w-4" /> Exit</button>
          <span className="text-sm text-muted-foreground">{idx + 1} / {dueCards.length}</span>
        </div>
        <div onClick={() => setFlipped((f) => !f)} className="cursor-pointer" style={{ perspective: 1000 }}>
          <AnimatePresence mode="wait">
            <motion.div key={flipped ? "back" : "front"} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} transition={{ duration: 0.2 }}
              className={cn("card-surface min-h-[280px] flex flex-col items-center justify-center p-8 text-center", flipped ? "border-ai/40 bg-ai/5" : "border-primary/40")}>
              <div className="eyebrow text-muted-foreground mb-3">{flipped ? "Answer" : "Question"} · {current.deck}</div>
              <div className="font-display text-xl font-semibold">{flipped ? current.back : current.front}</div>
              <div className="text-xs text-muted-foreground mt-6">Tap to flip</div>
            </motion.div>
          </AnimatePresence>
        </div>
        {flipped && (
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => review(false)} data-testid="fc-again"><Icon name="rotate-ccw" className="mr-2 h-4 w-4" /> Again</Button>
            <Button className="flex-1 bg-success hover:bg-success/90" onClick={() => review(true)} data-testid="fc-got-it"><Icon name="check" className="mr-2 h-4 w-4" /> Got it</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Flashcards" icon="layers" title="Flashcards & Spaced Repetition" subtitle="Generate AI flashcards and review them with a Leitner spaced-repetition system."
        actions={dueCards.length > 0 && <Button onClick={() => { setReviewing(true); setIdx(0); setFlipped(false); }} data-testid="start-review-btn"><Icon name="play" className="mr-2 h-4 w-4" /> Review {dueCards.length} due</Button>} />
      <AIBanner configured={status?.configured} />

      <div className="card-surface p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium mb-1.5 block">Generate a deck</label>
            <Input placeholder="e.g. JavaScript Promises, OOP concepts…" value={topic} onChange={(e) => setTopic(e.target.value)} data-testid="fc-topic-input" />
          </div>
          <Button onClick={generate} disabled={gen} className="h-10" data-testid="fc-generate-btn">
            {gen ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="sparkles" className="mr-2 h-4 w-4" /> Generate 8 cards</>}
          </Button>
        </div>
      </div>

      {isLoading ? <Loader /> : !data?.cards?.length ? (
        <EmptyState icon="layers" title="No flashcards yet" desc="Generate a deck above to start learning." />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">All cards ({data.cards.length})</h2>
            <span className="text-sm text-muted-foreground">{dueCards.length} due for review</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.cards.map((c) => (
              <div key={c._id} className="card-surface p-5" data-testid={`fc-card-${c._id}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="glow-badge rounded-full px-2.5 py-0.5 text-xs">{c.deck}</span>
                  <span className="text-xs text-muted-foreground">Box {c.box}</span>
                </div>
                <div className="font-medium text-sm mb-1">{c.front}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{c.back}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
