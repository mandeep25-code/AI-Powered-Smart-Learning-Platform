import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { PageHeader, Icon, SkeletonGrid, EmptyState } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const learningPaths = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master the fundamentals of coding interviews with structured DSA learning",
    icon: "cpu",
    color: "from-blue-500 to-cyan-500",
    topics: ["Arrays & Hashing", "Two Pointers", "Linked Lists", "Trees & Graphs", "Dynamic Programming"],
    progress: 35,
    enrolled: true,
  },
  {
    id: "webdev",
    title: "Full Stack Web Development",
    description: "Build modern web applications from frontend to backend",
    icon: "layout",
    color: "from-purple-500 to-pink-500",
    topics: ["HTML/CSS Fundamentals", "JavaScript Mastery", "React Framework", "Node.js Backend", "Database Design"],
    progress: 0,
    enrolled: false,
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Learn to design scalable and robust systems for production",
    icon: "server",
    color: "from-orange-500 to-red-500",
    topics: ["Load Balancing", "Caching Strategies", "Database Sharding", "Microservices", "API Design"],
    progress: 0,
    enrolled: false,
  },
  {
    id: "ml",
    title: "Machine Learning Basics",
    description: "Introduction to ML concepts and practical implementations",
    icon: "brain",
    color: "from-green-500 to-emerald-500",
    topics: ["Python for ML", "Data Preprocessing", "Supervised Learning", "Neural Networks", "Model Deployment"],
    progress: 0,
    enrolled: false,
  },
];

export default function LearningHub() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [track, setTrack] = useState("");
  const [selectedPath, setSelectedPath] = useState(null);

  const { data: tracksData } = useQuery({
    queryKey: ["tracks"],
    queryFn: async () => (await api.get("/content/tracks")).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["courses", track, q],
    queryFn: async () =>
      (await api.get("/courses", { params: { track: track || undefined, q: q || undefined } })).data,
  });

  const enroll = async (id, e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success("Enrolled! +10 XP");
      qc.invalidateQueries({ queryKey: ["courses"] });
    } catch (_) {
      toast.error("Could not enroll");
    }
  };

  if (selectedPath) {
    return <LearningWorkspace path={selectedPath} onBack={() => setSelectedPath(null)} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Learning Hub"
        icon="book-open"
        title="Master Your Skills"
        subtitle="Choose your learning path and start your journey to expertise with interactive courses and hands-on practice."
      />

      {/* Learning Paths */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Learning Paths</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {learningPaths.map((path, i) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPath(path)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon name={path.icon} className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {path.title}
                        </h3>
                        {path.enrolled && (
                          <Badge className="bg-success/10 text-success border-success/20">Enrolled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{path.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="list" className="h-3.5 w-3.5" />
                          {path.topics.length} topics
                        </span>
                        {path.enrolled && (
                          <span className="flex items-center gap-1">
                            <Icon name="check-circle" className="h-3.5 w-3.5 text-success" />
                            {path.progress}% complete
                          </span>
                        )}
                      </div>
                    </div>
                    <Icon name="chevron-right" className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  {path.enrolled && (
                    <div className="mt-4">
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Courses */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">All Courses</h2>
          <div className="relative flex-1 max-w-md">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
              data-testid="course-search"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTrack("")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              !track
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border hover:border-primary/40 hover:bg-muted/50"
            )}
            data-testid="track-filter-all"
          >
            All
          </button>
          {tracksData?.tracks?.map((t) => (
            <button
              key={t.slug}
              onClick={() => setTrack(t.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                track === t.slug
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              )}
              data-testid={`track-filter-${t.slug}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : data?.courses?.length === 0 ? (
          <EmptyState icon="book-open" title="No courses found" desc="Try a different track or search term." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.courses.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/app/courses/${c._id}`}
                  className="card-surface card-hover overflow-hidden block h-full"
                  data-testid={`course-card-${c._id}`}
                >
                  <div className="relative h-44">
                    {c.thumbnail ? (
                      <img src={c.thumbnail} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50" />
                    )}
                    <Badge className="absolute top-3 left-3 bg-black/60 text-white border-0 backdrop-blur-sm">
                      {c.level}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Icon name="user" className="h-3.5 w-3.5" />
                      {c.instructorName}
                      <span className="ml-auto flex items-center gap-1">
                        <Icon name="star" className="h-3.5 w-3.5 text-yellow-500" />
                        {c.rating}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-base mb-1.5 line-clamp-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
                    {c.enrolled ? (
                      <div>
                        <Progress value={c.progressPct} className="h-1.5 mb-2" />
                        <span className="text-xs text-muted-foreground">
                          {c.progressPct}% complete · {c.enrolledCount} enrolled
                        </span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={(e) => enroll(c._id, e)}
                        data-testid={`enroll-btn-${c._id}`}
                      >
                        Enroll now
                      </Button>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LearningWorkspace({ path, onBack }) {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(new Set([0]));

  const topic = path.topics[selectedTopic];
  const isCompleted = completedTopics.has(selectedTopic);
  const isLastTopic = selectedTopic === path.topics.length - 1;

  const markComplete = () => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(selectedTopic);
    setCompletedTopics(newCompleted);
    toast.success("Topic completed! +15 XP");
  };

  const goToNext = () => {
    if (!isLastTopic) {
      setSelectedTopic(selectedTopic + 1);
    }
  };

  const goToPrevious = () => {
    if (selectedTopic > 0) {
      setSelectedTopic(selectedTopic - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <Icon name="arrow-left" className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/10 text-primary border-primary/20">{path.title}</Badge>
            <span className="text-sm text-muted-foreground">
              {selectedTopic + 1} of {path.topics.length}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{topic}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrevious} disabled={selectedTopic === 0} className="rounded-lg">
            <Icon name="chevron-left" className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext} disabled={isLastTopic} className="rounded-lg">
            Next
            <Icon name="chevron-right" className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Topic List */}
        <div className="lg:col-span-1">
          <div className="card-surface p-4 sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">Topics</h3>
            <div className="space-y-2">
              {path.topics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTopic(i)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all",
                    selectedTopic === i
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                        completedTopics.has(i)
                          ? "bg-success text-white"
                          : selectedTopic === i
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {completedTopics.has(i) ? (
                        <Icon name="check" className="h-3 w-3" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className="text-sm line-clamp-1">{t}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Content Area */}
          <div className="card-surface p-6">
            <div className="space-y-6">
              {/* Video Placeholder */}
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center border border-border/50">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name="play-circle" className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Video content would be displayed here</p>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Learn the fundamental concepts of {topic}. This module covers the core principles,
                    common patterns, and practical applications you'll need to master this topic.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="check-circle" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Understanding the core data structure and its properties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="check-circle" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Common operations and their time complexity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="check-circle" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Real-world applications and use cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="check-circle" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Best practices and common pitfalls</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Code Example</h3>
                  <div className="bg-slate-900 rounded-lg p-4 border border-border/50 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
                      <code>{`// Example implementation
function solution(arr, target) {
    // Your code here
    const map = new Map();
    for (let i = 0; i < arr.length; i++) {
        const complement = target - arr[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(arr[i], i);
    }
    return [];
}`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Practice Resources</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { title: "Practice Problems", count: 8, icon: "code" },
                      { title: "Quizzes", count: 3, icon: "clipboard-list" },
                      { title: "Flashcards", count: 15, icon: "layers" },
                      { title: "Articles", count: 5, icon: "file-text" },
                    ].map((resource) => (
                      <button
                        key={resource.title}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                      >
                        <Icon name={resource.icon} className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{resource.title}</div>
                          <div className="text-xs text-muted-foreground">{resource.count} items</div>
                        </div>
                        <Icon name="chevron-right" className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between card-surface p-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={goToPrevious} disabled={selectedTopic === 0}>
                <Icon name="chevron-left" className="h-4 w-4 mr-2" />
                Previous Topic
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedTopic + 1} of {path.topics.length}
              </span>
              <Button variant="outline" size="sm" onClick={goToNext} disabled={isLastTopic}>
                Next Topic
                <Icon name="chevron-right" className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/app/tutor">
                <Button variant="outline" size="sm">
                  <Icon name="sparkles" className="h-4 w-4 mr-2" />
                  Ask AI Tutor
                </Button>
              </Link>
              {!isCompleted && (
                <Button size="sm" onClick={markComplete} className="bg-success hover:bg-success/90">
                  <Icon name="check" className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              {isCompleted && (
                <Button size="sm" disabled className="bg-muted text-muted-foreground">
                  <Icon name="check-circle" className="h-4 w-4 mr-2" />
                  Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}