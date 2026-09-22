import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { PageHeader, Icon, Loader } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const diffColor = { Easy: "text-success", Medium: "text-streak", Hard: "text-destructive" };

export default function CodingArena() {
  const [filter, setFilter] = useState("All");
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const [solved, setSolved] = useState([]);
  const { data: problems, isLoading } = useQuery({ queryKey: ["dsa-problems"], queryFn: async () => (await api.get("/content/dsa/problems")).data });
  const { data: sheets } = useQuery({ queryKey: ["dsa-sheets"], queryFn: async () => (await api.get("/content/dsa/sheets")).data });
  const { data: sysd } = useQuery({ queryKey: ["sysd"], queryFn: async () => (await api.get("/content/system-design")).data });

  useEffect(() => { try { setSolved(JSON.parse(localStorage.getItem("smartlearn:coding-solved") || "[]")); } catch (_) { setSolved([]); } }, []);
  const allProblems = useMemo(() => problems?.problems || [], [problems]);
  const topics = useMemo(() => ["All", ...new Set(allProblems.map((p) => p.topic))], [allProblems]);
  const filtered = allProblems.filter((p) => (filter === "All" || p.difficulty === filter) && (topic === "All" || p.topic === topic) && p.title.toLowerCase().includes(query.toLowerCase()));
  const toggleSolved = (url) => { const next = solved.includes(url) ? solved.filter((item) => item !== url) : [...solved, url]; setSolved(next); localStorage.setItem("smartlearn:coding-solved", JSON.stringify(next)); };

  return (
    <div>
      <PageHeader eyebrow="Coding Arena" icon="code" title="Coding & DSA Practice" subtitle="Curated interview problems, DSA sheets and system design — plus your AI coding mentor."
        actions={<Link to="/app/tutor"><Button variant="outline" data-testid="coding-mentor-btn"><Icon name="sparkles" className="mr-2 h-4 w-4" /> AI Coding Mentor</Button></Link>} />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card-surface p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Placement set</div><div className="font-display text-2xl font-bold mt-1">{allProblems.length || 50} problems</div></div>
        <div className="card-surface p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Your solved count</div><div className="font-display text-2xl font-bold mt-1 text-success">{solved.length}</div></div>
        <div className="card-surface p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Completion</div><div className="font-display text-2xl font-bold mt-1 text-primary">{allProblems.length ? Math.round(solved.length / allProblems.length * 100) : 0}%</div></div>
      </div>
      <Tabs defaultValue="problems">
        <TabsList className="mb-6">
          <TabsTrigger value="problems" data-testid="tab-problems">Important Problems</TabsTrigger>
          <TabsTrigger value="sheets" data-testid="tab-sheets">DSA Sheets</TabsTrigger>
          <TabsTrigger value="system" data-testid="tab-system">System Design</TabsTrigger>
        </TabsList>

        <TabsContent value="problems">
          <div className="flex gap-2 mb-4">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button key={d} onClick={() => setFilter(d)} className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition-colors", filter === d ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")} data-testid={`diff-${d}`}>{d}</button>
            ))}
          </div>
          <div className="flex flex-col gap-3 mb-4"><div className="relative"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Find a problem, pattern or topic…" /></div><div className="flex flex-wrap gap-2">{topics.map((item) => <button key={item} onClick={() => setTopic(item)} className={cn("rounded-full border px-3 py-1 text-xs font-medium", topic === item ? "border-secondary bg-secondary/10 text-secondary" : "border-border hover:border-secondary/40")}>{item}</button>)}</div></div>
          {isLoading ? <Loader /> : (
            <div className="card-surface overflow-hidden">
              <div className="divide-y divide-border">
                {filtered.map((p, i) => (
                  <div key={p.url} className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors" data-testid={`problem-${i}`}>
                    <button onClick={() => toggleSolved(p.url)} aria-label={`Toggle ${p.title} solved`} className={cn("h-6 w-6 rounded-full shrink-0 border flex items-center justify-center", solved.includes(p.url) ? "bg-success border-success text-white" : "border-muted-foreground/40 text-transparent")}><Icon name="check" className="h-4 w-4" /></button>
                    <Icon name="code-2" className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-medium", solved.includes(p.url) && "line-through text-muted-foreground")}>{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.topic} · {p.pattern} · {p.complexity}</div>
                    </div>
                    <div className="hidden sm:flex gap-1">{p.companies.slice(0, 2).map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                    <span className={cn("text-sm font-semibold w-16 text-right", diffColor[p.difficulty])}>{p.difficulty}</span>
                    <a href={p.url} target="_blank" rel="noreferrer" className="p-1"><Icon name="external-link" className="h-4 w-4 text-muted-foreground" /></a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sheets">
          <div className="grid sm:grid-cols-2 gap-4">
            {sheets?.sheets?.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="card-surface card-hover p-6 flex items-center gap-4" data-testid={`sheet-${i}`}>
                <div className="h-12 w-12 rounded-xl bg-ai/10 text-ai flex items-center justify-center"><Icon name="file-spreadsheet" className="h-6 w-6" /></div>
                <div className="flex-1">
                  <div className="font-display font-semibold">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.count} problems · {s.level}</div>
                </div>
                <Icon name="arrow-up-right" className="h-5 w-5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-3">
            {sysd?.topics?.map((t, i) => (
              <a key={i} href={t.url} target="_blank" rel="noreferrer" className="card-surface card-hover p-5 flex items-center gap-4" data-testid={`sysd-${i}`}>
                <div className="h-10 w-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center"><Icon name="network" className="h-5 w-5" /></div>
                <div className="flex-1"><div className="font-medium">{t.title}</div></div>
                <Badge variant="outline">{t.level}</Badge>
                <Icon name="external-link" className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
