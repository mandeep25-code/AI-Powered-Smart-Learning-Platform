const bcrypt = require("bcryptjs");
const { User, Course, Topic, PremiumContent } = require("../models");
const { SEED_COURSES, SEED_PREMIUM } = require("../data/content");

async function seed() {
  // Users
  async function ensureUser(email, name, password, role, extra = {}) {
    let u = await User.findOne({ email });
    if (!u) {
      const passwordHash = await bcrypt.hash(password, 10);
      u = await User.create({ email, name, passwordHash, role, ...extra });
      console.log(`[seed] created ${role}: ${email}`);
    }
    return u;
  }

  const admin = await ensureUser(process.env.ADMIN_EMAIL || "admin@smartlearn.com", "Admin", process.env.ADMIN_PASSWORD || "Admin@123", "admin");
  const teacher = await ensureUser("teacher@smartlearn.com", "Prof. Ada Lovelace", "Teacher@123", "teacher");
  await ensureUser("student@smartlearn.com", "Alex Student", "Student@123", "student", {
    careerGoal: "Become a Full Stack Developer",
    careerTrack: "mern",
    xp: 320,
    level: 1,
    studyMinutes: 480,
    streak: { count: 2, best: 5, lastActive: new Date() },
  });

  // Built-in courses: create missing ones and refresh lesson notes / videos
  // without wiping instructor-created courses or learner progress (topic IDs stay).
  for (const c of SEED_COURSES) {
    let course = await Course.findOne({ title: c.title, instructor: teacher._id });
    if (!course) {
      course = await Course.create({
        title: c.title, description: c.description, category: c.category, track: c.track,
        level: c.level, thumbnail: c.thumbnail, tags: c.tags, instructor: teacher._id,
        instructorName: teacher.name, enrolledCount: Math.floor(Math.random() * 400) + 50,
      });
      console.log(`[seed] created course: ${c.title}`);
    } else {
      await Course.updateOne(
        { _id: course._id },
        { $set: { description: c.description, category: c.category, track: c.track, level: c.level, thumbnail: c.thumbnail, tags: c.tags } }
      );
    }
    for (let i = 0; i < (c.topics || []).length; i++) {
      const topic = c.topics[i];
      await Topic.findOneAndUpdate(
        { course: course._id, title: topic.title },
        { $set: { ...topic, course: course._id, order: i } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }

  // Premium content
  const premiumCount = await PremiumContent.countDocuments();
  if (premiumCount === 0) {
    await PremiumContent.insertMany(SEED_PREMIUM);
    console.log(`[seed] seeded ${SEED_PREMIUM.length} premium items`);
  }
}

module.exports = { seed };
