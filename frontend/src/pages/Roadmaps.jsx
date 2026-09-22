import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { PageHeader, Icon, Loader, EmptyState, AIBanner } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const statusStyle = {
  todo: "bg-muted text-muted-foreground border-border",
  "in-progress": "bg-secondary/10 text-secondary border-secondary/30",
  done: "bg-success/10 text-success border-success/30",
};
const nextStatus = { todo: "in-progress", "in-progress": "done", done: "todo" };

export default function Roadmaps() {
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const [track, setTrack] = useState(params.get("track") || "mern");
  const [goal, setGoal] = useState("");
  const [gen, setGen] = useState(false);

  const { data: tracks } = useQuery({ queryKey: ["tracks"], queryFn: async () => (await api.get("/content/tracks")).data });
  const { data, isLoading } = useQuery({ queryKey: ["roadmaps"], queryFn: async () => (await api.get("/ai/roadmaps")).data });
  const { data: status } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await api.get("/ai/status")).data });

  const generate = async () => {
    setGen(true);
    try {
      await api.post("/ai/roadmap", { track, goal });
      toast.success("Roadmap generated! +20 XP");
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
    } catch (_) { toast.error("Generation failed"); }
    finally { setGen(false); }
  };

  const toggleNode = async (rid, nid, current) => {
    try {
      await api.put(`/ai/roadmap/${rid}/node/${nid}`, { status: nextStatus[current] });
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
    } catch (_) {}
  };

  return (
    <div>
      <PageHeader eyebrow="AI Roadmaps" icon="route" title="Learning Roadmaps" subtitle="Generate a step-by-step, personalised roadmap for any career track." />
      <AIBanner configured={status?.configured} />

      <div className="card-surface p-6 mb-8">
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Career track</label>
            <Select value={track} onValueChange={setTrack}>
              <SelectTrigger data-testid="roadmap-track-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {tracks?.tracks?.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your goal (optional)</label>
            <Input placeholder="e.g. Land a full-stack internship" value={goal} onChange={(e) => setGoal(e.target.value)} data-testid="roadmap-goal-input" />
          </div>
          <Button onClick={generate} disabled={gen} className="h-10" data-testid="roadmap-generate-btn">
            {gen ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="sparkles" className="mr-2 h-4 w-4" /> Generate</>}
          </Button>
        </div>
      </div>

      {isLoading ? <Loader /> : data?.roadmaps?.length === 0 ? (
        <EmptyState icon="route" title="No roadmaps yet" desc="Pick a track and generate your first AI roadmap above." />
      ) : (
        <div className="space-y-8">
          {data.roadmaps.map((rm) => {
            const doneCount = rm.nodes.filter((n) => n.status === "done").length;
            const pct = Math.round((doneCount / Math.max(rm.nodes.length, 1)) * 100);
            return (
              <div key={rm._id} className="card-surface p-6" data-testid={`roadmap-${rm._id}`}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{rm.title}</h2>
                    <p className="text-sm text-muted-foreground">{doneCount}/{rm.nodes.length} steps done · {pct}%{rm.generatedByAI ? " · AI generated" : ""}</p>
                  </div>
                </div>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  {rm.nodes.map((n, i) => (
                    <motion.div key={n._id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="relative">
                      <div className={cn("absolute -left-[18px] top-1.5 h-3.5 w-3.5 rounded-full border-2", n.status === "done" ? "bg-success border-success" : n.status === "in-progress" ? "bg-secondary border-secondary" : "bg-background border-border")} />
                      <div className="rounded-lg border border-border p-4 flex items-start gap-3">
                        <div className="flex-1">
                          <div className="font-medium">{n.title}</div>
                          <div className="text-sm text-muted-foreground">{n.description}</div>
                          <div className="text-xs text-muted-foreground/70 mt-1">~{n.durationWeeks} weeks</div>
                        </div>
                        <button onClick={() => toggleNode(rm._id, n._id, n.status)} className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors", statusStyle[n.status])} data-testid={`node-status-${n._id}`}>
                          {n.status}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
