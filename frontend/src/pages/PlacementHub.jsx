import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Icon } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const careerTracks = [
  {
    id: "sde",
    title: "Software Development Engineer",
    company: "Top Tech Companies",
    icon: "code",
    color: "from-blue-500 to-cyan-500",
    progress: 65,
    stages: [
      { name: "DSA Fundamentals", completed: true },
      { name: "System Design", completed: true },
      { name: "Frontend Development", completed: true },
      { name: "Backend Development", completed: false },
      { name: "Mock Interviews", completed: false },
    ],
  },
  {
    id: "data-science",
    title: "Data Scientist",
    company: "Analytics & AI Companies",
    icon: "brain",
    color: "from-purple-500 to-pink-500",
    progress: 30,
    stages: [
      { name: "Python & Statistics", completed: true },
      { name: "Machine Learning", completed: false },
      { name: "Data Visualization", completed: false },
      { name: "Deep Learning", completed: false },
      { name: "Case Studies", completed: false },
    ],
  },
  {
    id: "product",
    title: "Product Manager",
    company: "Product Companies",
    icon: "briefcase",
    color: "from-orange-500 to-red-500",
    progress: 0,
    stages: [
      { name: "Product Strategy", completed: false },
      { name: "User Research", completed: false },
      { name: "Roadmap Planning", completed: false },
      { name: "Metrics & Analytics", completed: false },
      { name: "Stakeholder Management", completed: false },
    ],
  },
];

const placementStats = [
  { label: "Applications Sent", value: 12, icon: "send", color: "text-blue-500" },
  { label: "Interviews Scheduled", value: 5, icon: "calendar", color: "text-green-500" },
  { label: "Offers Received", value: 1, icon: "trophy", color: "text-yellow-500" },
  { label: "Profile Views", value: 89, icon: "eye", color: "text-purple-500" },
];

const upcomingDeadlines = [
  { company: "Google", role: "SDE-1", date: "2024-09-25", type: "interview" },
  { company: "Amazon", role: "SDE-2", date: "2024-09-28", type: "application" },
  { company: "Microsoft", role: "Frontend Engineer", date: "2024-10-02", type: "interview" },
];

const recommendedActions = [
  { title: "Complete DSA Course", priority: "high", icon: "book-open", link: "/app/courses" },
  { title: "Practice Mock Interviews", priority: "medium", icon: "mic", link: "/app/interview" },
  { title: "Update Resume", priority: "high", icon: "file-text", link: "/app/resume" },
  { title: "Take Aptitude Test", priority: "medium", icon: "calculator", link: "/app/aptitude" },
];

export default function PlacementHub() {
  const [selectedTrack, setSelectedTrack] = useState(null);

  if (selectedTrack) {
    return <CareerTrackDetail track={selectedTrack} onBack={() => setSelectedTrack(null)} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow text-primary mb-1">Career Development</div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Placement Hub</h1>
        </div>
        <Button className="bg-gradient-to-r from-primary to-ai">
          <Icon name="plus" className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {placementStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border/50 bg-card/50 p-4"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted ${stat.color} mb-3`}>
              <Icon name={stat.icon} className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Career Tracks */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Career Tracks</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {careerTracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedTrack(track)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon name={track.icon} className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {track.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{track.company}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{track.progress}%</span>
                    </div>
                    <Progress value={track.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {track.stages.filter((s) => s.completed).length} of {track.stages.length} stages
                      </span>
                      <Icon name="chevron-right" className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
            <Link to="/app/analytics" className="text-sm text-primary hover:text-primary/80">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="calendar" className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{deadline.company}</div>
                  <div className="text-sm text-muted-foreground">{deadline.role}</div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={deadline.type === "interview" ? "default" : "outline"}
                    className={deadline.type === "interview" ? "bg-primary" : ""}
                  >
                    {deadline.type}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">{deadline.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recommended Actions</h3>
            <Icon name="sparkles" className="h-5 w-5 text-ai" />
          </div>
          <div className="space-y-2">
            {recommendedActions.map((action, i) => (
              <Link key={i} to={action.link}>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                      action.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon name={action.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">{action.title}</div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs mt-1",
                        action.priority === "high"
                          ? "border-destructive/30 text-destructive"
                          : "border-primary/30 text-primary"
                      )}
                    >
                      {action.priority} priority
                    </Badge>
                  </div>
                  <Icon name="chevron-right" className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Resume Studio", icon: "file-text", link: "/app/resume", color: "from-blue-500 to-cyan-500" },
          { title: "Interview Prep", icon: "mic", link: "/app/interview", color: "from-purple-500 to-pink-500" },
          { title: "Aptitude Arena", icon: "calculator", link: "/app/aptitude", color: "from-orange-500 to-red-500" },
          { title: "Career Launchpad", icon: "rocket", link: "/app/launchpad", color: "from-green-500 to-emerald-500" },
        ].map((item, i) => (
          <Link key={i} to={item.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative p-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                  <Icon name={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CareerTrackDetail({ track, onBack }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <Icon name="arrow-left" className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{track.title}</h1>
          <p className="text-muted-foreground">{track.company}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{track.progress}%</div>
          <div className="text-sm text-muted-foreground">Overall Progress</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card-surface p-6">
        <Progress value={track.progress} className="h-3 mb-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{track.stages.filter((s) => s.completed).length} of {track.stages.length} stages completed</span>
          <span>{track.progress}% to goal</span>
        </div>
      </div>

      {/* Career Roadmap */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Career Roadmap</h2>
        <div className="space-y-3">
          {track.stages.map((stage, i) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                stage.completed
                  ? "bg-success/5 border-success/30"
                  : "bg-muted/30 border-border/50"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  stage.completed
                    ? "bg-success text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {stage.completed ? (
                  <Icon name="check" className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{i + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{stage.name}</div>
                <div className="text-sm text-muted-foreground">
                  {stage.completed ? "Completed" : "In Progress"}
                </div>
              </div>
              {stage.completed ? (
                <Badge className="bg-success text-white border-0">Done</Badge>
              ) : (
                <Button size="sm" variant="outline">
                  Start
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="card-surface p-6">
        <h3 className="font-semibold text-foreground mb-4">Track Resources</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: "Study Materials", icon: "book", count: 24 },
            { title: "Practice Problems", icon: "code", count: 150 },
            { title: "Mock Interviews", icon: "mic", count: 8 },
            { title: "Company Guides", icon: "building", count: 12 },
          ].map((resource) => (
            <button
              key={resource.title}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              <Icon name={resource.icon} className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm">{resource.title}</div>
                <div className="text-xs text-muted-foreground">{resource.count} items</div>
              </div>
              <Icon name="chevron-right" className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}