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

const suggestions = [
  { title: "Advanced React Patterns", level: "Advanced", icon: "layout", rating: 4.9, students: "2.5k" },
  { title: "System Design Masterclass", level: "Expert", icon: "server", rating: 4.8, students: "1.8k" },
  { title: "Machine Learning Engineering", level: "Advanced", icon: "brain", rating: 4.7, students: "3.2k" },
];

const activityData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.8 },
  { day: "Wed", hours: 1.2 },
  { day: "Thu", hours: 4.5 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 5.5 },
  { day: "Sun", hours: 3.2 },
];

const learningGoals = [
  { title: "Complete DSA Course", progress: 75, deadline: "2 weeks" },
  { title: "Build Portfolio Project", progress: 40, deadline: "1 month" },
  { title: "Master System Design", progress: 20, deadline: "3 months" },
];

export default function DashboardConcept1() {
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
    return <Loader label="Loading your premium workspace…" />;
  }

  const s = data.stats;
  const active = data.coursesInProgress?.[0];
  const name = user?.name?.split(" ")[0] || "Learner";
  const progress = active?.progressPct || 0;
  const maxHours = Math.max(...activityData.map(d => d.hours));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Online</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{name}</span>
            </h1>
            <p className="text-slate-400">Continue your journey to excellence</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="text-white font-bold">{(user?.name || "U").slice(0, 2).toUpperCase()}</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
          </div>
        </motion.div>

        {/* Glassmorphism Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: "flame", value: s.streak, label: "Day Streak", color: "from-orange-500 to-red-500", bg: "bg-orange-500/10" },
            { icon: "zap", value: s.xp, label: "Total XP", color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10" },
            { icon: "book-open", value: data.coursesInProgress?.length || 0, label: "Active Courses", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
            { icon: "trophy", value: data.achievements?.filter((a) => a.unlocked).length || 0, label: "Achievements", color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg shadow-purple-500/25`}>
                  <Icon name={stat.icon} className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Focus Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mb-3">In Progress</Badge>
                    <h2 className="text-2xl font-bold text-white mb-2">{active?.title || "DSA Masterclass"}</h2>
                    <p className="text-slate-400">Continue where you left off</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{progress}%</div>
                    <div className="text-slate-400 text-sm">Complete</div>
                  </div>
                </div>
                <Progress value={progress} className="h-3 mb-6" />
                <div className="flex items-center gap-4">
                  <Button
                    onClick={startLearning}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25"
                  >
                    <Icon name="play" className="h-5 w-5 mr-2" />
                    Continue Learning
                  </Button>
                  <Link to="/app/courses">
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      View All Courses
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Learning Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Learning Activity</h3>
                  <Badge variant="outline" className="border-slate-600 text-slate-400">This Week</Badge>
                </div>
                <div className="flex items-end justify-between h-32 gap-2">
                  {activityData.map((item, i) => (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300 hover:from-purple-400 hover:to-pink-400"
                        style={{ height: `${(item.hours / maxHours) * 100}%` }}
                      />
                      <span className="text-xs text-slate-400">{item.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                  <span className="text-slate-400 text-sm">Total this week</span>
                  <span className="text-white font-semibold">{activityData.reduce((a, b) => a + b.hours, 0).toFixed(1)}h</span>
                </div>
              </div>
            </motion.div>

            {/* Learning Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Learning Goals</h3>
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                    <Icon name="plus" className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
                <div className="space-y-4">
                  {learningGoals.map((goal, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{goal.title}</span>
                          <span className="text-slate-400 text-sm">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">{goal.deadline}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative backdrop-blur-xl bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/25">
                    <span className="text-3xl font-bold text-white">{s.level}</span>
                  </div>
                  <div className="text-white font-semibold mb-1">Current Level</div>
                  <div className="text-slate-400 text-sm">{s.xp} XP</div>
                </div>
                <Progress value={s.nextLevelPct} className="h-3 mb-3" />
                <div className="text-center text-slate-400 text-sm">{s.nextLevelPct}% to next level</div>
              </div>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recommended</h3>
                  <Icon name="sparkles" className="h-5 w-5 text-purple-400" />
                </div>
                <div className="space-y-3">
                  {suggestions.map((course, i) => (
                    <Link key={i} to="/app/courses" className="block">
                      <div className="p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-purple-500/50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400">
                            <Icon name={course.icon} className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">{course.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{course.level}</Badge>
                              <span className="text-xs text-slate-400">{course.students} students</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "play", label: "Start", to: "/app/courses", color: "from-purple-500 to-pink-500" },
                    { icon: "message-circle", label: "AI Tutor", to: "/app/tutor", color: "from-blue-500 to-cyan-500" },
                    { icon: "code", label: "Practice", to: "/app/coding", color: "from-green-500 to-emerald-500" },
                    { icon: "book", label: "Quiz", to: "/app/quizzes", color: "from-orange-500 to-red-500" },
                  ].map((action) => (
                    <Link key={action.label} to={action.to}>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg`}>
                          <Icon name={action.icon} className="h-5 w-5" />
                        </div>
                        <span className="text-white text-sm">{action.label}</span>
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
  );
}