import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { PageHeader, Icon, AIBanner, EmptyState } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Quizzes() {
  const qc = useQueryClient();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState("5");
  const [gen, setGen] = useState(false);
  const [active, setActive] = useState(null); // quiz being taken
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const { data: status } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await api.get("/ai/status")).data });
  const { data: attempts } = useQuery({ queryKey: ["attempts"], queryFn: async () => (await api.get("/quizzes/attempts")).data });

  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setGen(true);
    try {
      const { data } = await api.post("/ai/quiz", { topic, difficulty, count: Number(count) });
      setActive(data.quiz);
      setAnswers(new Array(data.quiz.questions.length).fill(-1));
      setResult(null);
    } catch (_) { toast.error("Could not generate quiz"); }
    finally { setGen(false); }
  };

  const submit = async () => {
    try {
      const { data } = await api.post(`/quizzes/${active._id}/submit`, { answers });
      setResult(data);
      toast.success(`You scored ${data.pct}%!`);
      qc.invalidateQueries({ queryKey: ["attempts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (_) { toast.error("Submit failed"); }
  };

  // Quiz taking view
  if (active && !result) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setActive(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><Icon name="x" className="h-4 w-4" /> Exit quiz</button>
        <h1 className="font-display text-2xl font-extrabold mb-6">{active.title}</h1>
        <div className="space-y-6">
          {active.questions.map((q, qi) => (
            <div key={qi} className="card-surface p-6" data-testid={`quiz-q-${qi}`}>
              <div className="font-medium mb-4">{qi + 1}. {q.question}</div>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setAnswers((a) => a.map((v, i) => i === qi ? oi : v))} data-testid={`quiz-q-${qi}-opt-${oi}`}
                    className={cn("w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors", answers[qi] === oi ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/40")}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full h-11 mt-6" onClick={submit} disabled={answers.includes(-1)} data-testid="quiz-submit-btn">
          Submit quiz ({answers.filter((a) => a >= 0).length}/{answers.length} answered)
        </Button>
      </div>
    );
  }

  // Result view
  if (result) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card-surface p-8 text-center mb-6">
          <div className={cn("inline-flex h-20 w-20 rounded-full items-center justify-center mb-4", result.pct >= 70 ? "bg-success/10 text-success" : "bg-streak/10 text-streak")}>
            <span className="font-display text-2xl font-bold">{result.pct}%</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold">You scored {result.score}/{result.total}</h1>
          <p className="text-muted-foreground mt-1">{result.pct >= 80 ? "Outstanding! Quiz Master badge earned." : result.pct >= 50 ? "Good effort — review the explanations below." : "Keep practising, you'll get there!"}</p>
        </div>
        <div className="space-y-3">
          {result.review.map((r, i) => (
            <div key={i} className={cn("card-surface p-5", r.correct ? "border-success/30" : "border-destructive/30")}>
              <div className="flex items-start gap-2 mb-2">
                <Icon name={r.correct ? "check-circle-2" : "x-circle"} className={cn("h-5 w-5 shrink-0 mt-0.5", r.correct ? "text-success" : "text-destructive")} />
                <div className="font-medium">{r.question}</div>
              </div>
              <div className="text-sm text-muted-foreground ml-7">
                <div>Correct answer: <span className="text-success font-medium">{r.options[r.answerIndex]}</span></div>
                {r.explanation && <div className="mt-1">{r.explanation}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => { setActive(null); setResult(null); }}>Back</Button>
          <Button className="flex-1" onClick={generate}>New quiz</Button>
        </div>
      </div>
    );
  }

  // Generator + history
  return (
    <div>
      <PageHeader eyebrow="Quizzes" icon="list-checks" title="AI Quiz Generator" subtitle="Generate adaptive quizzes on any topic and track your performance over time." />
      <AIBanner configured={status?.configured} />

      <div className="card-surface p-6 mb-8">
        <div className="grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Topic</label>
            <Input placeholder="e.g. React Hooks, Binary Search…" value={topic} onChange={(e) => setTopic(e.target.value)} data-testid="quiz-topic-input" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger data-testid="quiz-difficulty"><SelectValue /></SelectTrigger>
              <SelectContent>{["easy", "medium", "hard"].map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Questions</label>
            <Select value={count} onValueChange={setCount}>
              <SelectTrigger data-testid="quiz-count"><SelectValue /></SelectTrigger>
              <SelectContent>{["5", "8", "10"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={gen} className="h-10" data-testid="quiz-generate-btn">
            {gen ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="sparkles" className="mr-2 h-4 w-4" /> Generate</>}
          </Button>
        </div>
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Your quiz history</h2>
      {!attempts?.attempts?.length ? (
        <EmptyState icon="list-checks" title="No quizzes taken yet" desc="Generate your first quiz above to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attempts.attempts.map((a) => {
            const pct = Math.round((a.score / a.total) * 100);
            return (
              <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm line-clamp-1">{a.quizTitle}</span>
                  <span className={cn("text-sm font-bold", pct >= 70 ? "text-success" : "text-streak")}>{pct}%</span>
                </div>
                <div className="text-xs text-muted-foreground">{a.score}/{a.total} correct · {new Date(a.createdAt).toLocaleDateString()}</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
