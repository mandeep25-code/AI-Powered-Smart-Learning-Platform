const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { User, Activity } = require("../models");
const { ACHIEVEMENTS } = require("../utils/gamify");

const router = express.Router();

router.get("/achievements", requireAuth, async (req, res) => {
  res.json({ achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlocked: req.user.achievements.includes(a.key) })) });
});

router.get("/leaderboard", requireAuth, async (req, res) => {
  const users = await User.find().select("name avatar xp level streak").sort({ xp: -1 }).limit(20);
  res.json({
    leaderboard: users.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      avatar: u.avatar,
      xp: u.xp,
      level: u.level,
      streak: u.streak?.count || 0,
      isMe: u._id.toString() === req.user._id.toString(),
    })),
  });
});

router.get("/activity", requireAuth, async (req, res) => {
  const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ activities });
});

// Log a study session (used by "start 30-min session" button / streak keeper).
router.post("/session", requireAuth, async (req, res) => {
  const { minutes = 30 } = req.body || {};
  const { award } = require("../utils/gamify");
  await User.findByIdAndUpdate(req.user._id, { $inc: { studyMinutes: minutes } });
  const result = await award(req.user._id, { xp: 25, type: "session", title: `Completed a ${minutes}-min study session` });
  res.json({ user: result?.user, unlocked: result?.unlocked || [] });
});

module.exports = router;
