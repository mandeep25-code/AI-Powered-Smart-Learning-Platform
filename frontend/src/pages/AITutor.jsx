import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Icon, AIBanner } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MODES = [
  { key: "tutor", label: "Study Tutor", icon: "sparkles", placeholder: "Ask anything — explain a concept, solve a doubt…" },
  { key: "coding", label: "Coding Mentor", icon: "code", placeholder: "Paste code or ask about DSA, debugging, complexity…" },
  { key: "voice", label: "Voice Tutor", icon: "mic", placeholder: "Speak or type — replies are read aloud." },
];

const CONVERSATION_STARTERS = [
  "Explain closures in JavaScript",
  "Give me a DSA study plan",
  "What is Big-O notation?",
  "Help me debug this code",
  "Explain React hooks",
];

export default function AITutor() {
  const [mode, setMode] = useState("tutor");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);
  const recRef = useRef(null);

  const { data: status } = useQuery({
    queryKey: ["ai-status"],
    queryFn: async () => (await api.get("/ai/status")).data,
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  useEffect(() => {
    setMessages([]);
  }, [mode]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/tutor", {
        message: content,
        history,
        mode: mode === "voice" ? "voice" : mode,
      });
      setStreaming(true);
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let cursor = 0;
      const timer = window.setInterval(() => {
        cursor = Math.min(data.reply.length, cursor + 12);
        setMessages((m) =>
          m.map((message, index) =>
            index === m.length - 1 ? { ...message, content: data.reply.slice(0, cursor) } : message
          )
        );
        if (cursor >= data.reply.length) {
          window.clearInterval(timer);
          setStreaming(false);
        }
      }, 18);
      if ((speak || mode === "voice") && "speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(data.reply.slice(0, 500));
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    } catch (_) {
      setStreaming(false);
      toast.error("AI request failed");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't respond right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setInput(t);
      send(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const activeMode = MODES.find((m) => m.key === mode);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow text-primary mb-1">AI Assistant</div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">AI Learning Workspace</h1>
        </div>
        <div className="flex gap-2 bg-muted/50 rounded-xl p-1.5 border border-border/50">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              data-testid={`mode-${m.key}`}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                mode === m.key
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon name={m.icon} className="h-4 w-4" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AIBanner configured={status?.configured} />

      {/* Chat Area */}
      <div className="flex-1 card-surface overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
              >
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-ai text-white flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
                  <Icon name={activeMode.icon} className="h-10 w-10" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {activeMode.label}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {activeMode.placeholder}
                </p>
              </motion.div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {CONVERSATION_STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-4 py-2 rounded-full border border-border/50 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-4", m.role === "user" && "flex-row-reverse")}
              data-testid={`msg-${m.role}-${i}`}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  m.role === "user"
                    ? "bg-gradient-to-br from-secondary to-secondary/60 text-secondary-foreground"
                    : "bg-gradient-to-br from-primary to-ai text-white"
                )}
              >
                <Icon name={m.role === "user" ? "user" : "sparkles"} className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  "rounded-2xl px-5 py-3 max-w-[80%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm",
                  m.role === "user"
                    ? "bg-gradient-to-br from-secondary/10 to-secondary/5 text-secondary-foreground border border-secondary/20"
                    : "bg-gradient-to-br from-muted to-muted/50 text-foreground border border-border/50"
                )}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-ai text-white flex items-center justify-center shadow-sm">
                <Icon name="sparkles" className="h-5 w-5" />
              </div>
              <div className="rounded-2xl px-5 py-3 bg-muted border border-border/50">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 p-4 bg-card/50">
          <div className="flex items-end gap-3">
            <button
              onClick={() => setSpeak((s) => !s)}
              title="Read replies aloud"
              className={cn(
                "h-11 w-11 rounded-xl border flex items-center justify-center transition-all",
                speak
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
              )}
              data-testid="tts-toggle"
            >
              <Icon name={speak ? "volume-2" : "volume-x"} className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMic}
              title="Voice input"
              className={cn(
                "h-11 w-11 rounded-xl border flex items-center justify-center transition-all",
                listening
                  ? "border-destructive bg-destructive/10 text-destructive pulse-ring"
                  : "border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
              )}
              data-testid="mic-btn"
            >
              <Icon name="mic" className="h-5 w-5" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={activeMode.placeholder}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border/50 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 max-h-32 transition-all"
              data-testid="tutor-input"
            />
            <Button
              onClick={() => send()}
              disabled={loading || streaming || !input.trim()}
              className="h-11 px-5 rounded-xl"
              data-testid="tutor-send-btn"
            >
              <Icon name="send" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}