const express = require("express");
const { User } = require("../models");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.put("/profile", requireAuth, async (req, res) => {
  const allowed = ["name", "bio", "avatar", "careerGoal", "careerTrack", "dailyGoalMinutes", "preferences"];
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-passwordHash");
  res.json({ user });
});

module.exports = router;
