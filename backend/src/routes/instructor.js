const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { Course, Topic, Progress, Resource, User } = require("../models");

const router = express.Router();
router.use(requireAuth, requireRole("teacher", "admin"));

// Teacher dashboard summary
router.get("/dashboard", async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  const courseIds = courses.map((c) => c._id);
  const enrollments = await Progress.find({ course: { $in: courseIds } });
  const totalStudents = new Set(enrollments.map((e) => e.user.toString())).size;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progressPct, 0) / enrollments.length)
    : 0;
  res.json({
    stats: {
      courses: courses.length,
      totalEnrollments: enrollments.length,
      totalStudents,
      avgProgress,
    },
    courses,
  });
});

router.get("/courses", async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
  res.json({ courses });
});

router.post("/courses", async (req, res) => {
  const { title, description = "", category = "General", track = "", level = "Beginner", thumbnail = "", tags = [] } = req.body || {};
  if (!title) return res.status(400).json({ error: "title is required" });
  const course = await Course.create({
    title, description, category, track, level, thumbnail, tags,
    instructor: req.user._id, instructorName: req.user.name,
  });
  res.status(201).json({ course });
});

router.put("/courses/:id", async (req, res) => {
  const course = await Course.findOneAndUpdate({ _id: req.params.id, instructor: req.user._id }, req.body, { new: true });
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json({ course });
});

router.delete("/courses/:id", async (req, res) => {
  await Course.deleteOne({ _id: req.params.id, instructor: req.user._id });
  await Topic.deleteMany({ course: req.params.id });
  res.json({ ok: true });
});

router.get("/courses/:id/topics", async (req, res) => {
  const topics = await Topic.find({ course: req.params.id }).sort({ order: 1 });
  res.json({ topics });
});

router.post("/courses/:id/topics", async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, instructor: req.user._id });
  if (!course) return res.status(404).json({ error: "Course not found" });
  const count = await Topic.countDocuments({ course: course._id });
  const { title, content = "", type = "reading", resourceUrl = "", durationMin = 15 } = req.body || {};
  if (!title) return res.status(400).json({ error: "title is required" });
  const topic = await Topic.create({ course: course._id, title, content, type, resourceUrl, durationMin, order: count });
  res.status(201).json({ topic });
});

router.delete("/topics/:id", async (req, res) => {
  await Topic.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

// Student progress across the teacher's courses
router.get("/students", async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  const courseIds = courses.map((c) => c._id);
  const enrollments = await Progress.find({ course: { $in: courseIds } })
    .populate("user", "name email avatar")
    .populate("course", "title");
  res.json({
    students: enrollments.map((e) => ({
      name: e.user?.name,
      email: e.user?.email,
      course: e.course?.title,
      progressPct: e.progressPct,
      lastAccessed: e.lastAccessed,
    })),
  });
});

module.exports = router;
