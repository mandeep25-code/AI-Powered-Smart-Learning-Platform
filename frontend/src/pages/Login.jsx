import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiErr } from "@/lib/api";
import { Icon } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AuthShell({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex dark">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-border">
        <div className="aurora" />
        <img src="https://images.unsplash.com/photo-1584697964328-b1e7f63dca95?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-ai text-white"><Icon name="graduation-cap" className="h-5 w-5" /></div>
            <span className="font-display text-xl font-extrabold">SmartLearn</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight mb-4">Your AI learning<br /><span className="gradient-text">operating system.</span></h2>
            <p className="text-muted-foreground max-w-md">Courses, AI tutoring, roadmaps, DSA practice and placement prep — all in one beautiful workspace.</p>
          </div>
          <div className="text-sm text-muted-foreground">Trusted by ambitious CSE students.</div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-ai text-white"><Icon name="graduation-cap" className="h-5 w-5" /></div>
            <span className="font-display text-xl font-extrabold">SmartLearn</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/app");
    } catch (err) {
      toast.error(apiErr(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const demo = (role) => {
    const map = {
      student: ["student@smartlearn.com", "Student@123"],
      teacher: ["teacher@smartlearn.com", "Teacher@123"],
    };
    setEmail(map[role][0]);
    setPassword(map[role][1]);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your learning journey.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="mt-1.5" data-testid="login-email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="mt-1.5" data-testid="login-password" />
        </div>
        <Button type="submit" className="w-full h-11" disabled={loading} data-testid="login-submit">
          {loading ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => demo("student")} data-testid="demo-student-btn">Demo student</Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => demo("teacher")} data-testid="demo-teacher-btn">Demo teacher</Button>
      </div>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        New here? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
