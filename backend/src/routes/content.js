const express = require("express");
const { requireAuth } = require("../middleware/auth");
const data = require("../data/content");

const router = express.Router();
router.use(requireAuth);

router.get("/tracks", (req, res) => res.json({ tracks: data.CAREER_TRACKS }));
router.get("/tracks/:slug", (req, res) => {
  const track = data.CAREER_TRACKS.find((t) => t.slug === req.params.slug);
  if (!track) return res.status(404).json({ error: "Track not found" });
  res.json({ track });
});
router.get("/dsa/sheets", (req, res) => res.json({ sheets: data.DSA_SHEETS }));
router.get("/dsa/problems", (req, res) => res.json({ problems: data.DSA_PROBLEMS }));
router.get("/system-design", (req, res) => res.json({ topics: data.SYSTEM_DESIGN }));
router.get("/placement/companies", (req, res) => res.json({ companies: data.PLACEMENT_COMPANIES }));
router.get("/aptitude", (req, res) => res.json({ categories: data.APTITUDE_TOPICS }));
router.get("/quickrev", (req, res) => res.json({ resources: data.QUICKREV }));
router.get("/future-path", (req, res) => res.json({ paths: data.FUTURE_PATH }));

module.exports = router;
