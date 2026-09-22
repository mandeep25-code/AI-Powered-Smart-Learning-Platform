const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { Quiz, QuizAttempt } = require("../models");
const { award } = require("../utils/gamify");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const quizzes = await Quiz.find({ $or: [{ owner: req.user._id }, { owner: { $exists: false } }] })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ quizzes });
});

router.get("/attempts", requireAuth, async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ attempts });
});

router.get("/:id", requireAuth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  res.json({ quiz });
});

router.post("/:id/submit", requireAuth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  const { answers = [], durationSec = 0 } = req.body || {};
  let score = 0;
  const review = quiz.questions.map((q, i) => {
    const correct = answers[i] === q.answerIndex;
    if (correct) score++;
    return { question: q.question, chosen: answers[i], answerIndex: q.answerIndex, correct, explanation: q.explanation, options: q.options };
  });
  const total = quiz.questions.length;
  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    quizTitle: quiz.title,
    track: quiz.track,
    score,
    total,
    answers,
    durationSec,
  });
  const pct = Math.round((score / Math.max(total, 1)) * 100);
  await award(req.user._id, {
    xp: 20 + score * 5,
    type: "quiz",
    title: `Scored ${pct}% on ${quiz.title}`,
    meta: pct >= 80 ? { achievement: "quiz-master" } : {},
  });
  res.json({ attempt, score, total, pct, review });
});

module.exports = router;
