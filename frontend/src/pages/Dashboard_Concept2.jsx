import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Icon, Loader } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const skillLevels = [
  { skill: "JavaScript", level: 85, color: "bg-yellow-500" },
  { skill: "Python", level: 72, color: "bg-blue-500" },
  { skill: "React", level: 68, color: "bg-cyan-500" },
  { skill: "Node.js", level: 55, color: "bg-green-500" },
  { skill: "DSA", level: 45, color: "bg-purple-500" },
];

const upcomingEvents = [
  { title: "DSA Workshop", date: "Today, 3:00 PM", type: "workshop" },
  { title: "Mock Interview", date: "Tomorrow, 10:00 AM", type: "interview" },
  { title: "Project Review", date: "Friday, 2:00 PM", type: "review" },
];

const leaderboard = [
  { rank: 1, name: "Alex Chen", xp: 15420, avatar: "AC" },
  { rank: 2, name: "Sarah Kim", xp: 14850, avatar: "SK" },
  { rank: 3, name: "Mike Johnson", xp: 13920, avatar: "MJ" },
  { rank: 4, name: "You", xp: 12800, avatar: "YO", isUser: true },
  { rank: 5, name: "Emma Davis", xp: 12150, avatar: "ED" },
];

export default function DashboardConcept2() {
  const { user, updateUser } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get("/dashboard")).data,
  });

  const startLearning = async () => {
    try {
      const { data: result } = await api.post("/gamification/session", { minutes: 30 });
      if (result.user) updateUser(result.user);
      toast.success("Session started · +25 XP");
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (_) {
      toast.error("Could not start session");
    }
  };

  if (isLoading || !data) {
    return <Loader label="Loading your workspace…" />;
  }

  const s = data.stats;
  const active = data.coursesInProgress?.[0];
  const name = user?.name?.split(" ")[0] || "Learner";
  const progress = active?.progressPct || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Hello, <span className="text-primary">{name}</span>
            </h1>
            <p className="text-muted-foreground">Your learning progress at a glance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{s.xp}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="zap" className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Courses", value: data.coursesInProgress?.length || 0, icon: "book-open", color: "text-blue-500" },
            { label: "Hours", value: "127.5", icon: "clock", color: "text-green-500" },
            { label: "Streak", value: `${s.streak} days`, icon: "flame", color: "text-orange-500" },
            { label: "Rank", value: "#4", icon: "trophy", color: "text-purple-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <Icon name={stat.icon} className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Course */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2">Active Course</Badge>
                  <h2 className="text-xl font-bold text-foreground">{active?.title || "DSA Masterclass"}</h2>
                  <p className="text-muted-foreground text-sm">Continue your learning journey</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{progress}%</div>
                </div>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex items-center gap-3">
                <Button onClick={startLearning} className="flex-1">
                  <Icon name="play" className="h-4 w-4 mr-2" />
                  Continue
                </Button>
                <Link to="/app/courses" className="flex-1">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </div>
            </motion.div>

            {/* Skills Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Skills Overview</h3>
              <div className="space-y-4">
                {skillLevels.map((skill, i) => (
                  <div key={skill.skill}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${skill.color} rounded-full transition-all duration-500`} style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Leaderboard</h3>
                <Link to="/app/analytics" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      entry.isUser ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      entry.rank <= 3 ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {entry.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {entry.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{entry.name}</div>
                    </div>
                    <div className="text-sm font-semibold text-primary">{entry.xp.toLocaleString()} XP</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - 1/3 */}
          <div className="space-y-6">
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-primary">{s.level}</span>
                </div>
                <div className="text-foreground font-semibold">Level {s.level}</div>
                <div className="text-sm text-muted-foreground">{s.xp} XP</div>
              </div>
              <Progress value={s.nextLevelPct} className="h-2 mb-2" />
              <div className="text-center text-xs text-muted-foreground">{s.nextLevelPct}% to next level</div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icon name="calendar" className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm">{event.title}</div>
                      <div className="text-xs text-muted-foreground">{event.date}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">{event.type}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "book-open", label: "Courses", to: "/app/courses" },
                  { icon: "message-circle", label: "AI Tutor", to: "/app/tutor" },
                  { icon: "code", label: "Practice", to: "/app/coding" },
                  { icon: "list-checks", label: "Quizzes", to: "/app/quizzes" },
                ].map((action) => (
                  <Link key={action.label} to={action.to}>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <Icon name={action.icon} className="h-6 w-6 text-primary" />
                      <span className="text-sm text-foreground">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}