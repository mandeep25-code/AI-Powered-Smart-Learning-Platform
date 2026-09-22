const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { Flashcard } = require("../models");
const { award } = require("../utils/gamify");

const router = express.Router();

// Leitner boxes -> days until next review
const INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };

router.get("/", requireAuth, async (req, res) => {
  const cards = await Flashcard.find({ user: req.user._id }).sort({ createdAt: -1 });
  const decks = [...new Set(cards.map((c) => c.deck))];
  res.json({ cards, decks });
});

router.get("/due", requireAuth, async (req, res) => {
  const cards = await Flashcard.find({ user: req.user._id, nextReview: { $lte: new Date() } }).sort({ nextReview: 1 });
  res.json({ cards });
});

router.post("/", requireAuth, async (req, res) => {
  const { front, back, deck = "General", track = "" } = req.body || {};
  if (!front || !back) return res.status(400).json({ error: "front and back are required" });
  const card = await Flashcard.create({ user: req.user._id, front, back, deck, track });
  res.status(201).json({ card });
});

router.post("/:id/review", requireAuth, async (req, res) => {
  const { correct } = req.body || {};
  const card = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  if (!card) return res.status(404).json({ error: "Card not found" });
  card.box = correct ? Math.min(5, card.box + 1) : 1;
  const days = INTERVALS[card.box] ?? 1;
  const next = new Date();
  next.setDate(next.getDate() + days);
  card.nextReview = next;
  await card.save();
  await award(req.user._id, { xp: 3, type: "flashcards", title: "Reviewed a flashcard" });
  res.json({ card });
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Flashcard.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ ok: true });
});

module.exports = router;
