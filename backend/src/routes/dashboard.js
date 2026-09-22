const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { Activity, Progress, QuizAttempt, Course } = require("../models");
const { ACHIEVEMENTS } = require("../utils/gamify");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const uid = req.user._id;
  const user = req.user;

  const [activities, progressList, attempts] = await Promise.all([
    Activity.find({ user: uid }).sort({ createdAt: -1 }).limit(8),
    Progress.find({ user: uid }).populate("course", "title thumbnail track"),
    QuizAttempt.find({ user: uid }).sort({ createdAt: -1 }).limit(20),
  ]);

  const avgQuiz =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + (a.total ? (a.score / a.total) * 100 : 0), 0) / attempts.length)
      : 0;

  const coursesInProgress = progressList.map((p) => ({
    id: p._id,
    courseId: p.course?._id,
    title: p.course?.title || "Course",
    thumbnail: p.course?.thumbnail || "",
    track: p.course?.track || "",
    progressPct: p.progressPct,
  }));

  const xpForNext = user.level * 500;
  const nextLevelPct = Math.min(100, Math.round(((user.xp % 500) / 500) * 100));

  res.json({
    stats: {
      streak: user.streak?.count || 0,
      bestStreak: user.streak?.best || 0,
      studyMinutes: user.studyMinutes || 0,
      studyHours: Math.round(((user.studyMinutes || 0) / 60) * 10) / 10,
      xp: user.xp,
      level: user.level,
      nextLevelPct,
      xpForNext,
      coursesActive: coursesInProgress.length,
      avgQuizScore: avgQuiz,
      quizzesTaken: attempts.length,
      dailyGoalMinutes: user.dailyGoalMinutes || 30,
    },
    careerGoal: user.careerGoal || "",
    careerTrack: user.careerTrack || "",
    coursesInProgress,
    recentActivity: activities,
    quizTrend: attempts.slice(0, 8).reverse().map((a) => ({
      name: (a.quizTitle || "Quiz").slice(0, 14),
      score: a.total ? Math.round((a.score / a.total) * 100) : 0,
    })),
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlocked: user.achievements.includes(a.key) })),
    recommendations: buildRecommendations(user, coursesInProgress),
  });
});

function buildRecommendations(user, courses) {
  const recs = [];
  if ((user.streak?.count || 0) === 0) recs.push({ icon: "flame", title: "Start your streak", desc: "Complete a 30-min session today to begin your streak." });
  if (courses.length === 0) recs.push({ icon: "book-open", title: "Enroll in a course", desc: "Browse the Learning Hub and pick your first course." });
  if (!user.careerTrack) recs.push({ icon: "compass", title: "Choose a career track", desc: "Set a track to unlock a personalized roadmap." });
  recs.push({ icon: "brain", title: "Take an AI skill assessment", desc: "Identify knowledge gaps and get a study plan." });
  recs.push({ icon: "code", title: "Solve today's DSA problem", desc: "Keep your problem-solving sharp in the Coding Arena." });
  return recs.slice(0, 4);
}

module.exports = router;
