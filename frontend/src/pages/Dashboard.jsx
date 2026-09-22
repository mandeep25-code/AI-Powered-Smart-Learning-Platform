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
  { title: "First Steps", description: "Complete your first lesson", icon: "footprints", unlocked: true, rarity: "common" },
  { title: "Week Warrior", description: "7-day learning streak", icon: "flame", unlocked: true, rarity: "rare" },
  { title: "Code Master", description: "Solve 100 coding problems", icon: "code", unlocked: false, rarity: "epic" },
  { title: "Quick Learner", description: "Complete 5 lessons in one day", icon: "zap", unlocked: false, rarity: "legendary" },
];

const notifications = [
  { title: "New course available", message: "Advanced React Patterns is now live", time: "2h ago", type: "info" },
  { title: "Achievement unlocked", message: "You earned Week Warrior badge", time: "1d ago", type: "success" },
  { title: "Reminder", message: "DSA Workshop starts in 1 hour", time: "2h ago", type: "warning" },
];

const rarityColors = {
  common: "from-slate-500 to-slate-600",
  rare: "from-blue-500 to-cyan-500",
  epic: "from-purple-500 to-pink-500",
  legendary: "from-yellow-500 to-orange-500"
};

export default function Dashboard() {
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
    return <Loader label="Loading your experience…" />;
  }

  const s = data.stats;
  const active = data.coursesInProgress?.[0];
  const name = user?.name?.split(" ")[0] || "Learner";
  const progress = active?.progressPct || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                <span className="text-cyan-400 text-xs font-mono tracking-widest">PREMIUM ACCESS</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-1 tracking-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">{name}</span>
              </h1>
              <p className="text-slate-400 font-mono text-sm">Your learning journey awaits</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono">{s.xp.toLocaleString()}</div>
                <div className="text-xs text-slate-500 font-mono tracking-wider">TOTAL XP</div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center backdrop-blur-xl">
                <Icon name="sparkles" className="h-7 w-7 text-purple-400" />
              </div>
            </div>
          </motion.div>

          {/* Premium Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { label: "COURSES", value: data.coursesInProgress?.length || 0, icon: "book-open", color: "from-purple-500 to-pink-500", border: "border-purple-500/30", bg: "bg-purple-500/10" },
              { label: "STREAK", value: `${s.streak} DAYS`, icon: "flame", color: "from-orange-500 to-red-500", border: "border-orange-500/30", bg: "bg-orange-500/10" },
              { label: "LEVEL", value: s.level, icon: "award", color: "from-cyan-500 to-blue-500", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
              { label: "RANK", value: `#${4}`, icon: "trophy", color: "from-yellow-500 to-orange-500", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4 flex items-center justify-center shadow-lg shadow-purple-500/25`}>
                    <Icon name={stat.icon} className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-mono tracking-wider">{stat.label}</div>
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
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                    <span className="text-green-400 text-xs font-mono tracking-widest">IN PROGRESS</span>
                  </div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 font-mono">{active?.title || "DSA Masterclass"}</h2>
                      <p className="text-slate-400 text-sm font-mono">Continue your learning journey</p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono">{progress}%</div>
                      <div className="text-xs text-slate-500 font-mono tracking-wider">COMPLETE</div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-3 mb-6 bg-slate-700" />
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={startLearning}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold font-mono shadow-lg shadow-purple-500/25"
                    >
                      <Icon name="play" className="h-5 w-5 mr-2" />
                      CONTINUE
                    </Button>
                    <Link to="/app/courses" className="flex-1">
                      <Button variant="outline" className="w-full border-slate-600 text-white font-mono hover:bg-slate-700">
                        DETAILS
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Weekly Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Icon name="bar-chart-2" className="h-6 w-6 text-cyan-400" />
                      <span className="text-white font-semibold tracking-wide">WEEKLY PERFORMANCE</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono tracking-wider">LAST 7 DAYS</span>
                  </div>
                  <div className="space-y-3">
                    {weeklyProgress.map((day, i) => (
                      <div key={day.day} className="flex items-center gap-4">
                        <span className="w-10 text-xs text-slate-500 font-mono tracking-wider">{day.day}</span>
                        <div className="flex-1 h-8 bg-slate-900 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg transition-all duration-500 hover:from-purple-400 hover:to-cyan-400"
                            style={{ width: `${(day.completed / day.total) * 100}%` }}
                          />
                        </div>
                        <span className="w-20 text-xs text-slate-400 font-mono text-right">{day.completed}/{day.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Premium Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl" />
                <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Icon name="award" className="h-6 w-6 text-yellow-400" />
                      <span className="text-white font-semibold tracking-wide">ACHIEVEMENTS</span>
                    </div>
                    <Link to="/app/achievements" className="text-xs text-cyan-400 font-mono hover:underline tracking-wider">VIEW ALL</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-4 rounded-xl border transition-all relative overflow-hidden",
                          achievement.unlocked
                            ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                            : "bg-slate-900/50 border-slate-700/50 opacity-50"
                        )}
                      >
                        {achievement.unlocked && (
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
                        )}
                        <div className="relative flex items-center gap-3 mb-2">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                            achievement.unlocked
                              ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white`
                              : "bg-slate-800 text-slate-600"
                          )}>
                            <Icon name={achievement.icon} className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-sm truncate">{achievement.title}</div>
                            <Badge className={cn(
                              "text-xs mt-1 border-0",
                              achievement.unlocked ? `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white` : "bg-slate-700 text-slate-500"
                            )}>
                              {achievement.rarity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="relative text-xs text-slate-400 line-clamp-2">{achievement.description}</div>
                      </div>
                    ))}
                  </div>
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
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-cyan-500/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative backdrop-blur-xl bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="zap" className="h-6 w-6 text-purple-400" />
                    <span className="text-white font-semibold tracking-wide">LEVEL STATUS</span>
                  </div>
                  <div className="text-center mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/30 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/25">
                      <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono">{s.level}</span>
                    </div>
                    <div className="text-white font-bold text-lg mb-1">LEVEL {s.level}</div>
                    <div className="text-sm text-slate-400 font-mono">{s.xp.toLocaleString()} XP</div>
                  </div>
                  <Progress value={s.nextLevelPct} className="h-3 mb-3 bg-slate-700" />
                  <div className="text-center text-xs text-slate-500 font-mono tracking-wider">{s.nextLevelPct}% TO NEXT LEVEL</div>
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="bell" className="h-6 w-6 text-cyan-400" />
                      <span className="text-white font-semibold tracking-wide">NOTIFICATIONS</span>
                    </div>
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">{notifications.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notification, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-purple-500/30 transition-all">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2 shadow-lg",
                            notification.type === "success" ? "bg-green-400 shadow-green-400/50" :
                            notification.type === "warning" ? "bg-yellow-400 shadow-yellow-400/50" : "bg-cyan-400 shadow-cyan-400/50"
                          )} />
                          <div className="flex-1">
                            <div className="text-white text-sm font-semibold">{notification.title}</div>
                            <div className="text-slate-400 text-xs">{notification.message}</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-2 tracking-wider">{notification.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="zap" className="h-6 w-6 text-purple-400" />
                    <span className="text-white font-semibold tracking-wide">QUICK ACCESS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "book-open", label: "COURSES", to: "/app/courses", color: "from-purple-500 to-pink-500" },
                      { icon: "message-circle", label: "AI TUTOR", to: "/app/tutor", color: "from-blue-500 to-cyan-500" },
                      { icon: "code", label: "PRACTICE", to: "/app/coding", color: "from-green-500 to-emerald-500" },
                      { icon: "list-checks", label: "QUIZZES", to: "/app/quizzes", color: "from-orange-500 to-red-500" },
                    ].map((action) => (
                      <Link key={action.label} to={action.to}>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform`}>
                            <Icon name={action.icon} className="h-6 w-6" />
                          </div>
                          <span className="text-xs text-white font-mono tracking-wider">{action.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}