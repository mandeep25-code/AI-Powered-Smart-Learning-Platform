import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHeader, Icon, AIBanner } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function InterviewPrep() {
  const [role, setRole] = useState("Software Engineer");
  const [resumeText, setResumeText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const { data: status } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await api.get("/ai/status")).data });

  const start = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/interview/questions", { role, resumeText, count: 6 });
      setQuestions(data.questions);
      setStarted(true);
      setIdx(0);
      setAnswer("");
      setFeedback("");
    } catch (_) { toast.error("Could not start"); }
    finally { setLoading(false); }
  };

  const getFeedback = async () => {
    if (!answer.trim()) return toast.error("Type your answer first");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/interview/feedback", { role, question: questions[idx], answer });
      setFeedback(data.reply);
    } catch (_) { toast.error("Feedback failed"); }
    finally { setLoading(false); }
  };

  const next = () => { setIdx((i) => i + 1); setAnswer(""); setFeedback(""); };

  return (
    <div>
      <PageHeader eyebrow="Interview Prep" icon="mic" title="AI Interview Simulator" subtitle="Practice role-specific and resume-based interviews with instant AI feedback." />
      <AIBanner configured={status?.configured} />

      {!started ? (
        <div className="card-surface p-6 max-w-2xl">
          <div className="mb-4">
            <label className="text-sm font-medium mb-1.5 block">Target role</label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} data-testid="iv-role-input" />
          </div>
          <div className="mb-5">
            <label className="text-sm font-medium mb-1.5 block">Paste resume / skills (optional — generates tailored questions)</label>
            <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={5} placeholder="Paste your resume text or key skills…" className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" data-testid="iv-resume-input" />
          </div>
          <Button onClick={start} disabled={loading} data-testid="iv-start-btn">
            {loading ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="play" className="mr-2 h-4 w-4" /> Start interview</>}
          </Button>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Question {idx + 1} of {questions.length}</span>
            <button onClick={() => setStarted(false)} className="text-sm text-muted-foreground hover:text-foreground">End session</button>
          </div>
          <div className="card-surface p-6 mb-4 border-primary/30">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="message-circle-question" className="h-5 w-5" /></div>
              <p className="font-medium text-lg">{questions[idx]}</p>
            </div>
          </div>
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder="Type your answer…" className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 mb-3" data-testid="iv-answer-input" />
          <div className="flex gap-3">
            <Button variant="outline" onClick={getFeedback} disabled={loading} data-testid="iv-feedback-btn"><Icon name="sparkles" className="mr-2 h-4 w-4" /> Get AI feedback</Button>
            {idx + 1 < questions.length && <Button onClick={next} data-testid="iv-next-btn">Next question <Icon name="arrow-right" className="ml-2 h-4 w-4" /></Button>}
          </div>
          {feedback && (
            <div className="card-surface p-5 mt-5 bg-ai/5 border-ai/30" data-testid="iv-feedback">
              <div className="flex items-center gap-2 mb-2 text-ai font-semibold"><Icon name="sparkles" className="h-4 w-4" /> Coach feedback</div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
