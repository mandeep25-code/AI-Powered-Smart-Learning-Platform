const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { spawn } = require("child_process");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const router = express.Router();
const config = {
  cpp: { command: "g++", extension: "cpp", source: "main.cpp", build: ["-std=c++17", "-O2", "main.cpp", "-o", process.platform === "win32" ? "program.exe" : "program"], run: process.platform === "win32" ? "program.exe" : "./program" },
  python: { command: "python", extension: "py", source: "main.py", run: "main.py" },
  java: { command: "javac", extension: "java", source: "Main.java", build: ["Main.java"], run: "Main" },
};

function execute(command, args, cwd, input = "") {
  return new Promise((resolve) => {
    let stdout = "", stderr = "", timedOut = false;
    const child = spawn(command, args, { cwd, shell: false, windowsHide: true });
    const timer = setTimeout(() => { timedOut = true; child.kill(); }, 4500);
    child.stdout.on("data", (data) => { stdout = (stdout + data).slice(0, 20000); });
    child.stderr.on("data", (data) => { stderr = (stderr + data).slice(0, 12000); });
    child.on("error", (error) => { stderr += error.code === "ENOENT" ? `${command} is not installed on this server.` : error.message; });
    child.on("close", (code) => { clearTimeout(timer); resolve({ stdout, stderr, code, timedOut }); });
    child.stdin.end(input);
  });
}

router.post("/run", requireAuth, async (req, res) => {
  const { language, code, input = "" } = req.body || {};
  const languageConfig = config[language];
  if (!languageConfig) return res.status(400).json({ error: "Choose C++, Java or Python." });
  if (typeof code !== "string" || !code.trim() || code.length > 30000 || String(input).length > 10000) return res.status(400).json({ error: "Code or input is invalid or too large." });
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "smartlearn-code-"));
  try {
    await fs.writeFile(path.join(directory, languageConfig.source), code, "utf8");
    if (languageConfig.build) {
      const build = await execute(languageConfig.command, languageConfig.build, directory);
      if (build.code !== 0 || build.stderr) return res.json({ stage: "compile", output: build.stdout, error: build.stderr, timedOut: build.timedOut });
    }
    const command = language === "python" ? "python" : language === "java" ? "java" : path.join(directory, languageConfig.run);
    const args = language === "python" ? [languageConfig.run] : language === "java" ? [languageConfig.run] : [];
    const run = await execute(command, args, directory, String(input));
    res.json({ stage: "run", output: run.stdout || "Program finished with no output.", error: run.stderr, timedOut: run.timedOut, exitCode: run.code });
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
});

module.exports = router;
