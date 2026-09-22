import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/common/ui";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: "play-circle", title: "Video Courses", desc: "Full lessons with notes, embedded YouTube lectures, and LeetCode practice on every topic." },
  { icon: "sparkles", title: "AI Study Tutor", desc: "24/7 tutor, roadmaps, quizzes & summaries powered by OpenRouter." },
  { icon: "route", title: "Career Roadmaps", desc: "Personalised paths for MERN, AI/ML, Data, Cloud, DevOps & more." },
  { icon: "code", title: "Coding Arena", desc: "Curated DSA sheets, LeetCode patterns & system design prep." },
  { icon: "briefcase", title: "Placement Hub", desc: "Company-wise prep, aptitude arena & AI interview simulator." },
  { icon: "file-text", title: "Resume Studio", desc: "ATS-friendly builder with AI improvement & PDF export." },
  { icon: "flame", title: "Gamified Streaks", desc: "Daily goals, XP, levels, badges & leaderboards keep you going." },
];

const TRACKS = ["MERN", "AI / ML", "Data Science", "DevOps", "Cloud", "Cybersecurity", "Data Analytics", "Product"];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden dark">
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg opacity-[0.35]" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-ai text-white">
            <Icon name="graduation-cap" className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight">SmartLearn</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" data-testid="nav-login-btn">Sign in</Button></Link>
          <Button onClick={() => navigate(user ? "/app" : "/register")} data-testid="nav-getstarted-btn">
            {user ? "Go to app" : "Get started"}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glow-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-6">
              <Icon name="sparkles" className="h-3.5 w-3.5" /> AI-Powered Learning Operating System
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Learn smarter.<br />
              <span className="gradient-text">Get placed faster.</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-xl leading-relaxed">
              Your all-in-one platform for courses, AI tutoring, career roadmaps, DSA practice,
              placement prep and resume building — engineered for CSE students.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button size="lg" onClick={() => navigate("/register")} data-testid="hero-start-btn" className="h-12 px-7 text-base">
                Start learning free <Icon name="arrow-right" className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="h-12 px-7 text-base">
                Explore demo
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-success" /> 9 career tracks</span>
              <span className="flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-success" /> AI tutor & roadmaps</span>
              <span className="flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-success" /> Placement ready</span>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="relative">
          <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-2 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"
              alt="Student learning"
              className="rounded-xl w-full h-[380px] object-cover"
            />
            <div className="absolute -bottom-5 -left-5 glass rounded-xl border border-border p-4 shadow-xl animate-float">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-streak/15 text-streak flex items-center justify-center"><Icon name="flame" className="h-5 w-5" /></div>
                <div><div className="font-display font-bold text-lg leading-none">12 day</div><div className="text-xs text-muted-foreground">learning streak</div></div>
              </div>
            </div>
            <div className="absolute -top-5 -right-5 glass rounded-xl border border-border p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-ai/15 text-ai flex items-center justify-center"><Icon name="sparkles" className="h-5 w-5" /></div>
                <div><div className="font-display font-bold text-lg leading-none">AI Tutor</div><div className="text-xs text-muted-foreground">always online</div></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="eyebrow text-primary mb-3">Everything you need</div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mb-12">
          One platform from first line of code to your first offer letter
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-surface card-hover p-6"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-4">
                <Icon name={f.icon} className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-ai/5 to-transparent p-8 lg:p-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Choose your career track</h2>
          <div className="flex flex-wrap gap-3">
            {TRACKS.map((t) => (
              <span key={t} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">Ready to level up?</h2>
        <p className="text-muted-foreground mb-8 text-lg">Join SmartLearn and turn your study time into real career momentum.</p>
        <Button size="lg" onClick={() => navigate("/register")} className="h-12 px-8 text-base" data-testid="cta-register-btn">
          Create your free account
        </Button>
      </section>

      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SmartLearn — Built with the MERN stack.
      </footer>
    </div>
  );
}
