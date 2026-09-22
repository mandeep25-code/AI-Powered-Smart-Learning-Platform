const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { Course, Resource } = require("../models");
const data = require("../data/content");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ results: [] });
  const rx = new RegExp(q, "i");

  const [courses, resources] = await Promise.all([
    Course.find({ title: rx }).limit(6),
    Resource.find({ title: rx }).limit(6),
  ]);

  const results = [];
  courses.forEach((c) => results.push({ type: "course", title: c.title, subtitle: c.category, link: `/app/courses/${c._id}` }));
  data.CAREER_TRACKS.filter((t) => rx.test(t.name)).forEach((t) =>
    results.push({ type: "track", title: t.name, subtitle: "Career Track", link: `/app/tracks/${t.slug}` })
  );
  data.DSA_PROBLEMS.filter((p) => rx.test(p.title)).slice(0, 6).forEach((p) =>
    results.push({ type: "dsa", title: p.title, subtitle: `${p.difficulty} · ${p.topic}`, link: "/app/coding" })
  );
  resources.forEach((r) => results.push({ type: "resource", title: r.title, subtitle: r.category, link: "/app/resources" }));
  data.QUICKREV.filter((r) => rx.test(r.name)).forEach((r) =>
    results.push({ type: "quickrev", title: r.name, subtitle: r.category, link: "/app/quickrev" })
  );

  res.json({ results: results.slice(0, 15) });
});

module.exports = router;
