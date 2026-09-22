import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHeader, Icon, AIBanner, EmptyState, Loader } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function StudyPlanner() {
  const qc = useQueryClient();
  const [goal, setGoal] = useState("");
  const [track, setTrack] = useState("mern");
  const [days, setDays] = useState("7");
  const [gen, setGen] = useState(false);

  const { data: status } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await api.get("/ai/status")).data });
  const { data: tracks } = useQuery({ queryKey: ["tracks"], queryFn: async () => (await api.get("/content/tracks")).data });
  const { data, isLoading } = useQuery({ queryKey: ["plans"], queryFn: async () => (await api.get("/study-plans")).data });

  const generate = async () => {
    setGen(true);
    try {
      await api.post("/ai/study-plan", { goal: goal || "Improve my skills", track, days: Number(days), minutesPerDay: 60 });
      toast.success("Study plan created! +15 XP");
      qc.invalidateQueries({ queryKey: ["plans"] });
      setGoal("");
    } catch (_) { toast.error("Generation failed"); }
    finally { setGen(false); }
  };

  const toggleTask = async (planId, dayIndex, taskIndex, done) => {
    try {
      await api.put(`/study-plans/${planId}/task`, { dayIndex, taskIndex, done });
      qc.invalidateQueries({ queryKey: ["plans"] });
      if (done) qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (_) {}
  };

  return (
    <div>
      <PageHeader eyebrow="Study Planner" icon="calendar-check" title="AI Study Planner" subtitle="Turn any goal into a day-by-day study schedule you can check off." />
      <AIBanner configured={status?.configured} />

      <div className="card-surface p-6 mb-8">
        <div className="grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Goal</label>
            <Input placeholder="e.g. Prepare for placements" value={goal} onChange={(e) => setGoal(e.target.value)} data-testid="plan-goal-input" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Track</label>
            <Select value={track} onValueChange={setTrack}>
              <SelectTrigger data-testid="plan-track"><SelectValue /></SelectTrigger>
              <SelectContent>{tracks?.tracks?.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Days</label>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger data-testid="plan-days"><SelectValue /></SelectTrigger>
              <SelectContent>{["3", "7", "14", "30"].map((d) => <SelectItem key={d} value={d}>{d} days</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={gen} className="h-10" data-testid="plan-generate-btn">
            {gen ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="sparkles" className="mr-2 h-4 w-4" /> Generate</>}
          </Button>
        </div>
      </div>

      {isLoading ? <Loader /> : !data?.plans?.length ? (
        <EmptyState icon="calendar-check" title="No study plans yet" desc="Generate a personalised study plan above." />
      ) : (
        <div className="space-y-8">
          {data.plans.map((p) => {
            const allTasks = p.days.flatMap((d) => d.tasks);
            const done = allTasks.filter((t) => t.done).length;
            const pct = Math.round((done / Math.max(allTasks.length, 1)) * 100);
            return (
              <div key={p._id} className="card-surface p-6" data-testid={`plan-${p._id}`}>
                <div className="mb-4">
                  <h2 className="font-display text-xl font-semibold">{p.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress value={pct} className="h-2 flex-1" />
                    <span className="text-sm font-semibold text-primary">{pct}%</span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {p.days.map((d, di) => (
                    <div key={di} className="rounded-lg border border-border p-4">
                      <div className="text-xs font-semibold text-primary mb-2">{new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
                      <div className="space-y-2">
                        {d.tasks.map((t, ti) => (
                          <button key={ti} onClick={() => toggleTask(p._id, di, ti, !t.done)} data-testid={`task-${p._id}-${di}-${ti}`}
                            className="flex items-start gap-2 text-left w-full group">
                            <span className={cn("mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors", t.done ? "bg-success border-success text-white" : "border-border group-hover:border-primary")}>
                              {t.done && <Icon name="check" className="h-3 w-3" />}
                            </span>
                            <span className={cn("text-sm", t.done && "line-through text-muted-foreground")}>{t.title} <span className="text-xs text-muted-foreground">· {t.durationMin}m</span></span>
                          </button>
                        ))}
                      </div>
                    </div>
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
