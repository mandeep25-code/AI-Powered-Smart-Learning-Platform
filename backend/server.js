require("dotenv").config();
const express = require("express");
require("express-async-errors"); // route async errors -> next(err) -> error middleware
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./src/config/db");
const { seed } = require("./src/utils/seed");

// Prevent process crash on unhandled promise rejections / uncaught exceptions in async route handlers.
// Express 4 does not forward rejected promises to error middleware; log and keep the server alive.
process.on("unhandledRejection", (err) => console.error("[unhandledRejection]", err));
process.on("uncaughtException", (err) => console.error("[uncaughtException]", err));

const app = express();
app.use(cors({ origin: (process.env.CORS_ORIGINS || "*").split(","), credentials: false }));
app.use(express.json({ limit: "5mb" }));

// All routes are prefixed with /api for the Kubernetes ingress.
const api = express.Router();

api.get("/", (req, res) => res.json({ message: "SmartLearn API", status: "ok" }));
api.get("/health", (req, res) => res.json({ status: "healthy", ts: new Date().toISOString() }));

api.use("/auth", require("./src/routes/auth"));
api.use("/users", require("./src/routes/users"));
api.use("/dashboard", require("./src/routes/dashboard"));
api.use("/ai", require("./src/routes/ai"));
api.use("/courses", require("./src/routes/courses"));
api.use("/quizzes", require("./src/routes/quizzes"));
api.use("/flashcards", require("./src/routes/flashcards"));
api.use("/study-plans", require("./src/routes/studyplanner"));
api.use("/resources", require("./src/routes/resources"));
api.use("/resumes", require("./src/routes/resume"));
api.use("/premium", require("./src/routes/premium"));
api.use("/instructor", require("./src/routes/instructor"));
api.use("/content", require("./src/routes/content"));
api.use("/gamification", require("./src/routes/gamification"));
api.use("/search", require("./src/routes/search"));
api.use("/compiler", require("./src/routes/compiler"));

app.use("/api", api);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error("[error]", err);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

const PORT = process.env.PORT || 8001;

(async () => {
  try {
    await connectDB();
    await seed();
    app.listen(PORT, "0.0.0.0", () => console.log(`[server] SmartLearn API on :${PORT}`));
  } catch (e) {
    console.error("[fatal] startup failed:", e);
    process.exit(1);
  }
})();
