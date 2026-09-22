const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { Course, Topic, Progress } = require("../models");
const { award } = require("../utils/gamify");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { track, q, category } = req.query;
  const filter = { isPublished: true };
  if (track) filter.track = track;
  if (category) filter.category = category;
  if (q) filter.title = { $regex: q, $options: "i" };
  const courses = await Course.find(filter).sort({ createdAt: -1 });
  const progress = await Progress.find({ user: req.user._id });
  const pmap = Object.fromEntries(progress.map((p) => [p.course.toString(), p.progressPct]));
  res.json({ courses: courses.map((c) => ({ ...c.toObject(), progressPct: pmap[c._id.toString()] || 0, enrolled: c._id.toString() in pmap })) });
});

router.get("/:id", requireAuth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  const topics = await Topic.find({ course: course._id }).sort({ order: 1 });
  const progress = await Progress.findOne({ user: req.user._id, course: course._id });
  res.json({
    course,
    topics,
    progress: progress || { completedTopics: [], progressPct: 0, enrolled: false },
    enrolled: !!progress,
  });
});

router.post("/:id/enroll", requireAuth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  let progress = await Progress.findOne({ user: req.user._id, course: course._id });
  if (!progress) {
    progress = await Progress.create({ user: req.user._id, course: course._id });
    await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });
    await award(req.user._id, { xp: 10, type: "course", title: `Enrolled in ${course.title}` });
  }
  res.json({ progress });
});

router.post("/:id/topic/:topicId/complete", requireAuth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  const topics = await Topic.find({ course: course._id });
  let progress = await Progress.findOne({ user: req.user._id, course: course._id });
  if (!progress) progress = await Progress.create({ user: req.user._id, course: course._id });

  const tid = req.params.topicId;
  const already = progress.completedTopics.some((t) => t.toString() === tid);
  if (!already) {
    progress.completedTopics.push(tid);
    const topic = topics.find((t) => t._id.toString() === tid);
    const mins = topic?.durationMin || 15;
    progress.progressPct = Math.round((progress.completedTopics.length / Math.max(topics.length, 1)) * 100);
    progress.lastAccessed = new Date();
    await progress.save();
    await require("../models").User.findByIdAndUpdate(req.user._id, { $inc: { studyMinutes: mins } });
    const isComplete = progress.progressPct >= 100;
    await award(req.user._id, {
      xp: isComplete ? 60 : 15,
      type: "learning",
      title: isComplete ? `Completed course: ${course.title}` : `Completed: ${topic?.title || "topic"}`,
      meta: isComplete ? { achievement: "course-complete" } : {},
    });
  }
  res.json({ progress });
});

module.exports = router;
