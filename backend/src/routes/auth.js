const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { signToken, requireAuth } = require("../middleware/auth");

const router = express.Router();

function publicUser(u) {
  const o = u.toObject ? u.toObject() : u;
  delete o.passwordHash;
  return o;
}

router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password are required" });
    email = String(email).toLowerCase().trim();
    if (String(password).length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "An account with this email already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const safeRole = ["student", "teacher"].includes(role) ? role : "student";
    const user = await User.create({ name, email, passwordHash, role: safeRole });
    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ error: "Registration failed", detail: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    email = String(email).toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ error: "Login failed", detail: e.message });
  }
});

router.post("/logout", requireAuth, (req, res) => res.json({ ok: true }));

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
