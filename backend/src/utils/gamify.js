const { User, Activity } = require("../models");

const ACHIEVEMENTS = [
  { key: "first-steps", title: "First Steps", description: "Complete your first learning activity", icon: "footprints", xp: 50 },
  { key: "streak-3", title: "On Fire", description: "Maintain a 3-day streak", icon: "flame", xp: 100 },
  { key: "streak-7", title: "Unstoppable", description: "Maintain a 7-day streak", icon: "zap", xp: 250 },
  { key: "quiz-master", title: "Quiz Master", description: "Score 80%+ on a quiz", icon: "brain", xp: 150 },
  { key: "course-complete", title: "Graduate", description: "Complete a full course", icon: "graduation-cap", xp: 300 },
  { key: "coder", title: "Code Warrior", description: "Solve 5 DSA problems", icon: "code", xp: 200 },
  { key: "resume-ready", title: "Career Ready", description: "Build your first resume", icon: "file-text", xp: 120 },
  { key: "level-5", title: "Rising Star", description: "Reach Level 5", icon: "star", xp: 0 },
];

function levelForXp(xp) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Award XP, update streak, log an activity, and unlock achievements.
async function award(userId, { xp = 0, type = "general", title, meta = {} }) {
  const user = await User.findById(userId);
  if (!user) return null;

  const now = new Date();
  const last = user.streak?.lastActive ? new Date(user.streak.lastActive) : null;
  if (!last) {
    user.streak.count = 1;
  } else if (!isSameDay(last, now)) {
    const diff = Math.floor((now - new Date(last.getFullYear(), last.getMonth(), last.getDate())) / 86400000);
    user.streak.count = diff === 1 ? (user.streak.count || 0) + 1 : 1;
  }
  user.streak.best = Math.max(user.streak.best || 0, user.streak.count);
  user.streak.lastActive = now;

  user.xp += xp;
  user.level = levelForXp(user.xp);

  // Achievement unlocks
  const unlocked = [];
  const add = (k) => {
    if (!user.achievements.includes(k)) {
      user.achievements.push(k);
      unlocked.push(k);
    }
  };
  add("first-steps");
  if (user.streak.count >= 3) add("streak-3");
  if (user.streak.count >= 7) add("streak-7");
  if (user.level >= 5) add("level-5");
  if (meta.achievement) add(meta.achievement);

  await user.save();
  if (title) await Activity.create({ user: userId, type, title, meta, xp });
  return { user, unlocked };
}

module.exports = { ACHIEVEMENTS, award, levelForXp };
