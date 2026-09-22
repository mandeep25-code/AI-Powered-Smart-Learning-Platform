const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { Resume } = require("../models");
const { award } = require("../utils/gamify");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json({ resumes });
});

router.post("/", requireAuth, async (req, res) => {
  const { title = "My Resume", template = "modern", data = {} } = req.body || {};
  const resume = await Resume.create({ user: req.user._id, title, template, data });
  await award(req.user._id, { xp: 30, type: "resume", title: "Created a resume", meta: { achievement: "resume-ready" } });
  res.status(201).json({ resume });
});

router.get("/:id", requireAuth, async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ error: "Resume not found" });
  res.json({ resume });
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, template, data, atsScore, atsFeedback } = req.body || {};
  const update = {};
  ["title", "template", "data", "atsScore", "atsFeedback"].forEach((k) => {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  });
  const resume = await Resume.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, update, { new: true });
  if (!resume) return res.status(404).json({ error: "Resume not found" });
  res.json({ resume });
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Resume.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ ok: true });
});

module.exports = router;
