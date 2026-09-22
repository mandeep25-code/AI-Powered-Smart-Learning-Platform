const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const { requireAuth } = require("../middleware/auth");
const { PremiumContent, Purchase } = require("../models");

const router = express.Router();

// List all premium content with entitlement flags (never expose protectedContent unless owned).
router.get("/", requireAuth, async (req, res) => {
  const [items, purchases] = await Promise.all([
    PremiumContent.find().sort({ createdAt: -1 }),
    Purchase.find({ user: req.user._id, status: "completed" }),
  ]);
  const owned = new Set(purchases.map((p) => p.content.toString()));
  const data = items.map((it) => {
    const o = it.toObject();
    const unlocked = owned.has(it._id.toString());
    delete o.protectedContent; // full content is served only via GET /:id/content
    return { ...o, unlocked };
  });
  res.json({ items: data });
});

// Create an order on Razorpay. The private key remains on the server.
router.post("/:id/order", requireAuth, async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: "Payments are not configured yet. Add Razorpay test keys to backend/.env." });
  }
  const item = await PremiumContent.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Content not found" });
  const existing = await Purchase.findOne({ user: req.user._id, content: item._id });
  if (existing && existing.status === "completed") return res.json({ purchase: existing, alreadyOwned: true });

  try {
    const receipt = `sl_${item._id.toString().slice(-8)}_${Date.now()}`;
    const response = await axios.post("https://api.razorpay.com/v1/orders", {
      amount: Math.round(item.price * 100), currency: "INR", receipt, notes: { contentId: item._id.toString(), userId: req.user._id.toString() },
    }, {
      auth: { username: process.env.RAZORPAY_KEY_ID, password: process.env.RAZORPAY_KEY_SECRET }, timeout: 20000,
    });
    const order = response.data;
    const purchase = existing
      ? await Purchase.findByIdAndUpdate(existing._id, { amount: item.price, currency: "INR", provider: "razorpay", providerOrderId: order.id, status: "pending" }, { new: true })
      : await Purchase.create({ user: req.user._id, content: item._id, amount: item.price, currency: "INR", provider: "razorpay", providerOrderId: order.id, status: "pending" });
    res.status(201).json({ order: { id: order.id, amount: order.amount, currency: order.currency }, keyId: process.env.RAZORPAY_KEY_ID, item: { title: item.title }, purchaseId: purchase._id });
  } catch (error) {
    console.error("[payment] Razorpay order creation failed", error.response?.data || error.message);
    res.status(502).json({ error: "Could not start payment. Please try again." });
  }
});

// Razorpay sends these fields after checkout. Verify the HMAC before granting access.
router.post("/:id/verify", requireAuth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ error: "Incomplete payment verification data" });
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(razorpay_signature);
  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) return res.status(400).json({ error: "Payment signature verification failed" });
  const item = await PremiumContent.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Content not found" });
  const purchase = await Purchase.findOne({ user: req.user._id, content: item._id, providerOrderId: razorpay_order_id, status: "pending" });
  if (!purchase) return res.status(404).json({ error: "Pending purchase not found" });
  purchase.status = "completed";
  purchase.providerPaymentId = razorpay_payment_id;
  purchase.providerSignature = razorpay_signature;
  await purchase.save();
  res.json({ purchase, verified: true });
});

// Access protected content — server-side entitlement check.
router.get("/:id/content", requireAuth, async (req, res) => {
  const item = await PremiumContent.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Content not found" });
  const purchase = await Purchase.findOne({ user: req.user._id, content: item._id, status: "completed" });
  if (!purchase) return res.status(403).json({ error: "Locked. Purchase this item to unlock its content." });
  res.json({ title: item.title, type: item.type, content: item.protectedContent });
});

router.get("/library", requireAuth, async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id, status: "completed" }).populate("content");
  res.json({ items: purchases.map((p) => ({ ...p.content.toObject(), purchasedAt: p.createdAt, unlocked: true })) });
});

module.exports = router;
