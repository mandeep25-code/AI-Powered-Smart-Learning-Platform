const express = require("express");
const { requireAuth } = require("../middleware/auth");
const ai = require("../services/aiService");
const { Roadmap, Quiz, ChatSession, StudyPlan, Flashcard, Resume } = require("../models");
const { CAREER_TRACKS } = require("../data/content");
const { award } = require("../utils/gamify");

const router = express.Router();

const trackBySlug = (slug) => CAREER_TRACKS.find((t) => t.slug === slug) || null;

/* ------------------------- AI Study Tutor / chatbot ------------------------- */
router.post("/tutor", requireAuth, async (req, res) => {
  const { message, history = [], mode = "tutor", sessionId } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });
  const systemMap = {
    tutor: "You are SmartLearn's friendly, expert AI Study Tutor. Explain clearly with examples, analogies and step-by-step reasoning. Keep responses focused and encouraging.",
    coding: "You are SmartLearn's AI Coding Mentor. Help with DSA, debugging and code review. Provide clean code, complexity analysis and hints before full solutions.",
    voice: "You are SmartLearn's AI Voice Tutor. Reply in short, natural, conversational sentences suitable for text-to-speech. Be concise.",
    doc: "You answer strictly based on the provided document context. If the answer is not in the context, say so.",
  };
  const messages = [...history.slice(-8), { role: "user", content: message }];
  const result = await ai.chat({ system: systemMap[mode] || systemMap.tutor, messages });

  let session;
  if (sessionId) session = await ChatSession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) session = new ChatSession({ user: req.user._id, mode, title: message.slice(0, 40) });
  session.messages.push({ role: "user", content: message });
  session.messages.push({ role: "assistant", content: result.reply });
  await session.save();
  if (result.configured) await award(req.user._id, { xp: 5, type: "ai", title: "Chatted with AI Tutor" });

  res.json({ ...result, sessionId: session._id });
});

router.get("/sessions", requireAuth, async (req, res) => {
  const sessions = await ChatSession.find({ user: req.user._id }).sort({ updatedAt: -1 }).limit(30);
  res.json({ sessions });
});

/* ------------------------- AI Learning Roadmap ------------------------- */
router.post("/roadmap", requireAuth, async (req, res) => {
  const { track, goal = "" } = req.body || {};
  const t = trackBySlug(track);
  const fallback = {
    title: `${t ? t.name : track || "Custom"} Roadmap`,
    nodes: (t ? t.skills : ["Foundations", "Core Concepts", "Projects", "Advanced", "Interview Prep"]).map((s, i) => ({
      title: s,
      description: `Build solid understanding of ${s} through practice and small projects.`,
      status: "todo",
      durationWeeks: 2,
      resources: [],
    })),
  };
  const out = await ai.generateJSON({
    system: "You are a curriculum designer. Output strict JSON only.",
    prompt: `Create a structured learning roadmap for the goal "${goal}" in the "${t ? t.name : track}" track. Return JSON: {"title": string, "nodes": [{"title": string, "description": string, "durationWeeks": number, "resources": [string]}]} with 6-9 progressive nodes.`,
    fallback,
  });
  const data = out.data || fallback;
  const roadmap = await Roadmap.create({
    user: req.user._id,
    title: data.title || fallback.title,
    track: track || "",
    goal,
    generatedByAI: out.configured && !out.error,
    nodes: (data.nodes || fallback.nodes).map((n) => ({ ...n, status: "todo" })),
  });
  await award(req.user._id, { xp: 20, type: "roadmap", title: `Generated roadmap: ${roadmap.title}` });
  res.json({ configured: out.configured, roadmap });
});

router.get("/roadmaps", requireAuth, async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ roadmaps });
});

router.put("/roadmap/:id/node/:nodeId", requireAuth, async (req, res) => {
  const rm = await Roadmap.findOne({ _id: req.params.id, user: req.user._id });
  if (!rm) return res.status(404).json({ error: "Roadmap not found" });
  const node = rm.nodes.id(req.params.nodeId);
  if (!node) return res.status(404).json({ error: "Node not found" });
  node.status = req.body.status || node.status;
  await rm.save();
  if (node.status === "done") await award(req.user._id, { xp: 15, type: "roadmap", title: `Completed: ${node.title}` });
  res.json({ roadmap: rm });
});

/* ------------------------- AI Quiz Generator ------------------------- */
function fallbackQuiz(topic, count) {
  const base = [
    { question: `Which statement best describes a core concept in ${topic}?`, options: ["A foundational principle", "An unrelated idea", "A deprecated tool", "None"], answerIndex: 0, explanation: "Focus on fundamentals first.", difficulty: "easy" },
    { question: `A good first step when learning ${topic} is to:`, options: ["Skip the basics", "Understand fundamentals & practice", "Memorize without practice", "Avoid projects"], answerIndex: 1, explanation: "Fundamentals + practice build mastery.", difficulty: "easy" },
    { question: `Which practice most improves retention in ${topic}?`, options: ["Cramming", "Spaced repetition & recall", "Passive reading only", "Ignoring mistakes"], answerIndex: 1, explanation: "Active recall and spaced repetition win.", difficulty: "medium" },
    { question: `To apply ${topic} effectively you should:`, options: ["Only read theory", "Build real projects", "Avoid feedback", "Never revise"], answerIndex: 1, explanation: "Applied projects cement knowledge.", difficulty: "medium" },
    { question: `A strong sign you understand ${topic} is that you can:`, options: ["Teach it simply", "Only copy code", "Recite definitions", "Guess randomly"], answerIndex: 0, explanation: "Teaching proves understanding.", difficulty: "hard" },
  ];
  return { title: `${topic} Quiz`, questions: base.slice(0, Math.min(count || 5, base.length)) };
}

router.post("/quiz", requireAuth, async (req, res) => {
  const { topic = "General", track = "", difficulty = "medium", count = 5 } = req.body || {};
  const fb = fallbackQuiz(topic, count);
  const out = await ai.generateJSON({
    system: "You are an assessment generator. Output strict JSON only.",
    prompt: `Generate a ${difficulty} multiple-choice quiz on "${topic}" with exactly ${count} questions. Return JSON: {"title": string, "questions": [{"question": string, "options": [4 strings], "answerIndex": number (0-3), "explanation": string, "difficulty": string}]}.`,
    fallback: fb,
  });
  const data = out.data || fb;
  const quiz = await Quiz.create({
    title: data.title || fb.title,
    topic,
    track,
    difficulty,
    generatedByAI: out.configured && !out.error,
    questions: (data.questions || fb.questions).slice(0, count),
    owner: req.user._id,
  });
  res.json({ configured: out.configured, quiz });
});

/* ------------------------- AI Skill Assessment + Gap Detection ------------------------- */
router.post("/assessment", requireAuth, async (req, res) => {
  const { track } = req.body || {};
  const t = trackBySlug(track);
  const topic = t ? t.name : track || "General CS";
  const out = await ai.generateJSON({
    system: "You are a skills assessor. Output strict JSON only.",
    prompt: `Create a 6-question diagnostic assessment for "${topic}" covering a range of subtopics. Return JSON {"title": string, "questions": [{"question": string, "options": [4 strings], "answerIndex": number, "explanation": string, "difficulty": string}]}.`,
    fallback: fallbackQuiz(topic, 6),
  });
  res.json({ configured: out.configured, assessment: out.data });
});

router.post("/gap-detection", requireAuth, async (req, res) => {
  const { track, score = 0, total = 1, weakTopics = [] } = req.body || {};
  const t = trackBySlug(track);
  const pct = Math.round((score / total) * 100);
  const fallback = {
    summary: `You scored ${pct}%. ${pct >= 70 ? "Strong foundation!" : "Focus on core fundamentals next."}`,
    gaps: weakTopics.length ? weakTopics : (t ? t.skills.slice(0, 3) : ["Fundamentals"]),
    recommendations: [
      "Revisit the topics you missed with focused practice.",
      "Use spaced-repetition flashcards for weak areas.",
      "Build a small project applying these concepts.",
    ],
  };
  const out = await ai.generateJSON({
    system: "You are a learning coach. Output strict JSON only.",
    prompt: `A student scored ${pct}% on a ${t ? t.name : track} assessment. Missed topics: ${weakTopics.join(", ") || "unknown"}. Return JSON {"summary": string, "gaps": [string], "recommendations": [string]}.`,
    fallback,
  });
  res.json({ configured: out.configured, analysis: out.data });
});

/* ------------------------- AI Study Planner ------------------------- */
router.post("/study-plan", requireAuth, async (req, res) => {
  const { goal = "Improve skills", track = "", days = 7, minutesPerDay = 60 } = req.body || {};
  const t = trackBySlug(track);
  const topics = t ? t.skills : ["Review", "Practice", "Project", "Assessment"];
  const dayList = Array.from({ length: Math.min(days, 30) }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const topic = topics[i % topics.length];
    return {
      date: d.toISOString().slice(0, 10),
      tasks: [
        { title: `Study: ${topic}`, done: false, durationMin: Math.round(minutesPerDay * 0.6) },
        { title: `Practice problems on ${topic}`, done: false, durationMin: Math.round(minutesPerDay * 0.4) },
      ],
    };
  });
  const fallback = { title: `${days}-Day Plan: ${goal}`, days: dayList };
  const out = await ai.generateJSON({
    system: "You are a study planner. Output strict JSON only.",
    prompt: `Create a ${days}-day study plan for goal "${goal}" in track "${t ? t.name : track}", ${minutesPerDay} min/day. Return JSON {"title": string, "days": [{"date": "YYYY-MM-DD", "tasks": [{"title": string, "durationMin": number}]}]}. Use dates starting today.`,
    fallback,
  });
  const data = out.data || fallback;
  const plan = await StudyPlan.create({
    user: req.user._id,
    title: data.title || fallback.title,
    goal,
    track,
    generatedByAI: out.configured && !out.error,
    days: (data.days || dayList).map((d) => ({ date: d.date, tasks: (d.tasks || []).map((t2) => ({ ...t2, done: false })) })),
  });
  await award(req.user._id, { xp: 15, type: "planner", title: `Created study plan: ${plan.title}` });
  res.json({ configured: out.configured, plan });
});

/* ------------------------- AI Notes / Summaries ------------------------- */
router.post("/notes", requireAuth, async (req, res) => {
  const { text = "", topic = "" } = req.body || {};
  const src = text || topic;
  if (!src) return res.status(400).json({ error: "Provide text or a topic" });
  const result = await ai.chat({
    system: "You produce concise, well-structured study notes using markdown headings, bullet points, and key-term highlights.",
    messages: [{ role: "user", content: text ? `Summarize and create study notes from:\n\n${text}` : `Create detailed study notes on the topic: ${topic}` }],
  });
  res.json(result);
});

/* ------------------------- AI Flashcard Generator ------------------------- */
router.post("/flashcards", requireAuth, async (req, res) => {
  const { topic = "General", track = "", count = 8, save = true } = req.body || {};
  const t = trackBySlug(track);
  const fallback = {
    cards: (t ? t.skills : ["Concept A", "Concept B", "Concept C"]).slice(0, count).map((s) => ({
      front: `What is ${s}?`,
      back: `${s} is a key concept in ${t ? t.name : topic}. Review its definition, use-cases and examples.`,
    })),
  };
  const out = await ai.generateJSON({
    system: "You generate study flashcards. Output strict JSON only.",
    prompt: `Generate ${count} flashcards on "${topic}". Return JSON {"cards": [{"front": string (question/term), "back": string (concise answer)}]}.`,
    fallback,
  });
  const cards = (out.data?.cards || fallback.cards).slice(0, count);
  let saved = [];
  if (save) {
    saved = await Flashcard.insertMany(
      cards.map((c) => ({ user: req.user._id, deck: topic, front: c.front, back: c.back, track }))
    );
    await award(req.user._id, { xp: 10, type: "flashcards", title: `Generated ${cards.length} flashcards on ${topic}` });
  }
  res.json({ configured: out.configured, cards, saved });
});

/* ------------------------- Resume Analysis ------------------------- */
router.post("/resume-analysis", requireAuth, async (req, res) => {
  const { resumeText = "", resumeId } = req.body || {};
  let text = resumeText;
  if (!text && resumeId) {
    const r = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (r) text = JSON.stringify(r.data);
  }
  if (!text) return res.status(400).json({ error: "Provide resumeText or resumeId" });
  const fallback = {
    atsScore: 68,
    strengths: ["Clear structure", "Relevant skills listed"],
    improvements: ["Add quantified achievements (numbers, %).", "Include more role-specific keywords.", "Add a concise professional summary."],
    missingKeywords: ["impact metrics", "leadership", "tools"],
  };
  const out = await ai.generateJSON({
    system: "You are an ATS resume analyzer. Output strict JSON only.",
    prompt: `Analyze this resume for ATS-friendliness. Return JSON {"atsScore": number 0-100, "strengths": [string], "improvements": [string], "missingKeywords": [string]}.\n\nRESUME:\n${text.slice(0, 4000)}`,
    fallback,
  });
  res.json({ configured: out.configured, analysis: out.data });
});

/* ------------------------- Interview Simulator ------------------------- */
router.post("/interview/questions", requireAuth, async (req, res) => {
  const { role = "Software Engineer", resumeText = "", count = 6 } = req.body || {};
  const fallback = {
    questions: [
      "Tell me about yourself and your background.",
      "Walk me through a challenging project you built.",
      "How do you approach debugging a hard problem?",
      "Explain a data structure you used recently and why.",
      "Describe a time you worked in a team under pressure.",
      "Where do you see your career in 3 years?",
    ].slice(0, count),
  };
  const out = await ai.generateJSON({
    system: "You are a technical interviewer. Output strict JSON only.",
    prompt: `Generate ${count} interview questions for a "${role}" role${resumeText ? ", tailored to this resume:\n" + resumeText.slice(0, 2000) : ""}. Mix behavioral + technical. Return JSON {"questions": [string]}.`,
    fallback,
  });
  res.json({ configured: out.configured, questions: out.data?.questions || fallback.questions });
});

router.post("/interview/feedback", requireAuth, async (req, res) => {
  const { question = "", answer = "", role = "Software Engineer" } = req.body || {};
  if (!answer) return res.status(400).json({ error: "answer is required" });
  const result = await ai.chat({
    system: "You are an interview coach. Give constructive feedback on the candidate's answer: rate it out of 10, list 2 strengths and 2 concrete improvements. Be encouraging and specific.",
    messages: [{ role: "user", content: `Role: ${role}\nQuestion: ${question}\nCandidate answer: ${answer}` }],
  });
  res.json(result);
});

/* ------------------------- Document Q&A ------------------------- */
router.post("/doc-qa", requireAuth, async (req, res) => {
  const { docText = "", question = "" } = req.body || {};
  if (!docText || !question) return res.status(400).json({ error: "docText and question are required" });
  const result = await ai.chat({
    system: "Answer the question using ONLY the provided document context. If the answer isn't present, say you couldn't find it in the document.",
    messages: [{ role: "user", content: `DOCUMENT:\n${docText.slice(0, 6000)}\n\nQUESTION: ${question}` }],
  });
  res.json(result);
});

router.get("/status", requireAuth, (req, res) => res.json({ configured: ai.isConfigured(), model: process.env.OPENROUTER_MODEL }));

module.exports = router;
