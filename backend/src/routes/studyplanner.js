const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { StudyPlan } = require("../models");
const { award } = require("../utils/gamify");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const plans = await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ plans });
});

router.post("/", requireAuth, async (req, res) => {
  const { title = "My Study Plan", goal = "", track = "", days = [] } = req.body || {};
  const plan = await StudyPlan.create({ user: req.user._id, title, goal, track, days });
  res.status(201).json({ plan });
});

router.put("/:id/task", requireAuth, async (req, res) => {
  const { dayIndex, taskIndex, done } = req.body || {};
  const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  const task = plan.days?.[dayIndex]?.tasks?.[taskIndex];
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.done = done;
  await plan.save();
  if (done) {
    await require("../models").User.findByIdAndUpdate(req.user._id, { $inc: { studyMinutes: task.durationMin || 30 } });
    await award(req.user._id, { xp: 10, type: "planner", title: `Completed task: ${task.title}` });
  }
  res.json({ plan });
});

router.delete("/:id", requireAuth, async (req, res) => {
  await StudyPlan.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ ok: true });
});

module.exports = router;
