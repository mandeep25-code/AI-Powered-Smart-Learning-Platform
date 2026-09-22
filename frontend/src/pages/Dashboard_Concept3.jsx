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

const weeklyProgress = [
  { day: "Mon", completed: 3, total: 5 },
  { day: "Tue", completed: 4, total: 5 },
  { day: "Wed", completed: 2, total: 5 },
  { day: "Thu", completed: 5, total: 5 },
  { day: "Fri", completed: 3, total: 5 },
  { day: "Sat", completed: 4, total: 5 },
  { day: "Sun", completed: 2, total: 5 },
];

const achievements = [
  { title: "First Steps", description: "Complete your first lesson", icon: "footprints", unlocked: true },
  { title: "Week Warrior", description: "7-day learning streak", icon: "flame", unlocked: true },
  { title: "Code Master", description: "Solve 100 coding problems", icon: "code", unlocked: false },
  { title: "Quick Learner", description: "Complete 5 lessons in one day", icon: "zap", unlocked: false },
];

const notifications = [
  { title: "New course available", message: "Advanced React Patterns is now live", time: "2h ago", type: "info" },
  { title: "Achievement unlocked", message: "You earned Week Warrior badge", time: "1d ago", type: "success" },
  { title: "Reminder", message: "DSA Workshop starts in 1 hour", time: "2h ago", type: "warning" },
];

export default function DashboardConcept3() {
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
    return <Loader label="Loading your command center…" />;
  }

  const s = data.stats;
  const active = data.coursesInProgress?.[0];
  const name = user?.name?.split(" ")[0] || "Learner";
  const progress = active?.progressPct || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Futuristic Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 text-xs font-mono tracking-widest">SYSTEM ONLINE</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">
                COMMAND CENTER
              </h1>
              <p className="text-slate-400 font-mono text-sm">Welcome back, Commander {name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400 font-mono">{s.xp.toLocaleString()}</div>
                <div className="text-xs text-slate-500 font-mono">TOTAL XP</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Icon name="cpu" className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </motion.div>

          {/* Command Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: "MISSIONS", value: data.coursesInProgress?.length || 0, icon: "target", color: "text-cyan-400", border: "border-cyan-500/30" },
              { label: "STREAK", value: `${s.streak} DAYS`, icon: "flame", color: "text-orange-400", border: "border-orange-500/30" },
              { label: "LEVEL", value: s.level, icon: "award", color: "text-purple-400", border: "border-purple-500/30" },
              { label: "RANK", value: `#${4}`, icon: "trophy", color: "text-yellow-400", border: "border-yellow-500/30" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-slate-900 border ${stat.border} flex items-center justify-center`}>
                    <Icon name={stat.icon} className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                    <div className="text-xs text-slate-500 font-mono tracking-wider">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Command Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Mission */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-mono tracking-widest">ACTIVE MISSION</span>
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-mono">{active?.title || "DSA PROTOCOL"}</h2>
                    <p className="text-slate-400 text-sm font-mono">Execute learning sequence</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-cyan-400 font-mono">{progress}%</div>
                    <div className="text-xs text-slate-500 font-mono">COMPLETE</div>
                  </div>
                </div>
                <Progress value={progress} className="h-2 mb-4 bg-slate-700" />
                <div className="flex items-center gap-3">
                  <Button
                    onClick={startLearning}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-mono"
                  >
                    <Icon name="play" className="h-4 w-4 mr-2" />
                    EXECUTE
                  </Button>
                  <Link to="/app/courses" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-600 text-white font-mono hover:bg-slate-700">
                      DETAILS
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Weekly Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Icon name="bar-chart-2" className="h-5 w-5 text-cyan-400" />
                    <span className="text-white font-semibold">WEEKLY PERFORMANCE</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">LAST 7 DAYS</span>
                </div>
                <div className="space-y-3">
                  {weeklyProgress.map((day, i) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <span className="w-8 text-xs text-slate-500 font-mono">{day.day}</span>
                      <div className="flex-1 h-6 bg-slate-900 rounded overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${(day.completed / day.total) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-xs text-slate-400 font-mono text-right">{day.completed}/{day.total}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="award" className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-semibold">ACHIEVEMENTS</span>
                  </div>
                  <Link to="/app/achievements" className="text-xs text-cyan-400 font-mono hover:underline">VIEW ALL</Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-4 rounded-lg border transition-all",
                        achievement.unlocked
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : "bg-slate-900/50 border-slate-700/50 opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          achievement.unlocked ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-800 text-slate-600"
                        )}>
                          <Icon name={achievement.icon} className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm truncate">{achievement.title}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right - 1/3 */}
            <div className="space-y-6">
              {/* Level Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="zap" className="h-5 w-5 text-cyan-400" />
                  <span className="text-white font-semibold">LEVEL STATUS</span>
                </div>
                <div className="text-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                    <span className="text-4xl font-bold text-cyan-400 font-mono">{s.level}</span>
                  </div>
                  <div className="text-white font-semibold mb-1">LEVEL {s.level}</div>
                  <div className="text-sm text-slate-400 font-mono">{s.xp.toLocaleString()} XP</div>
                </div>
                <Progress value={s.nextLevelPct} className="h-2 mb-2 bg-slate-700" />
                <div className="text-center text-xs text-slate-500 font-mono">{s.nextLevelPct}% TO NEXT LEVEL</div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="bell" className="h-5 w-5 text-cyan-400" />
                    <span className="text-white font-semibold">ALERTS</span>
                  </div>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">{notifications.length}</Badge>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          notification.type === "success" ? "bg-green-400" :
                          notification.type === "warning" ? "bg-yellow-400" : "bg-cyan-400"
                        )} />
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{notification.title}</div>
                          <div className="text-slate-400 text-xs">{notification.message}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-2">{notification.time}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Commands */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="terminal" className="h-5 w-5 text-cyan-400" />
                  <span className="text-white font-semibold">QUICK COMMANDS</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "book-open", label: "COURSES", to: "/app/courses" },
                    { icon: "message-circle", label: "AI TUTOR", to: "/app/tutor" },
                    { icon: "code", label: "PRACTICE", to: "/app/coding" },
                    { icon: "list-checks", label: "QUIZZES", to: "/app/quizzes" },
                  ].map((command) => (
                    <Link key={command.label} to={command.to}>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                        <Icon name={command.icon} className="h-6 w-6 text-cyan-400" />
                        <span className="text-xs text-white font-mono">{command.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}