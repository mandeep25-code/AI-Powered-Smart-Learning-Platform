const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { Resource } = require("../models");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { category, q, track } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (track) filter.track = track;
  if (q) filter.title = { $regex: q, $options: "i" };
  const resources = await Resource.find(filter).sort({ createdAt: -1 });
  res.json({ resources });
});

router.post("/", requireAuth, async (req, res) => {
  const { title, description = "", type = "link", url = "", text = "", category = "General", track = "" } = req.body || {};
  if (!title) return res.status(400).json({ error: "title is required" });
  const resource = await Resource.create({
    title, description, type, url, text, category, track, uploadedBy: req.user._id,
  });
  res.status(201).json({ resource });
});

router.get("/:id", requireAuth, async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: "Resource not found" });
  res.json({ resource });
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Resource.deleteOne({ _id: req.params.id, uploadedBy: req.user._id });
  res.json({ ok: true });
});

module.exports = router;
