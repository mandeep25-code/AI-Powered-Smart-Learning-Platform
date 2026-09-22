const axios = require("axios");

const BASE = () => process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const MODEL = () => process.env.OPENROUTER_MODEL || "openrouter/free";

function isConfigured() {
  return !!(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim());
}

const NOT_CONFIGURED_MSG =
  "AI is not yet configured. Add your OPENROUTER_API_KEY in the backend .env file to activate live AI responses. Meanwhile, SmartLearn is showing curated offline guidance.";

async function chatRaw(messages, { temperature = 0.7, maxTokens = 1200, json = false } = {}) {
  const body = { model: MODEL(), messages, temperature, max_tokens: maxTokens };
  if (json) body.response_format = { type: "json_object" };
  const res = await axios.post(`${BASE()}/chat/completions`, body, {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_URL || "https://smartlearn.app",
      "X-Title": "SmartLearn",
    },
    timeout: 60000,
  });
  return res.data?.choices?.[0]?.message?.content || "";
}

function extractJSON(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {}
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (_) {}
  }
  return null;
}

// Generic chat used by tutor / coding mentor / voice tutor.
async function chat({ system, messages }) {
  if (!isConfigured()) {
    return { configured: false, reply: NOT_CONFIGURED_MSG };
  }
  try {
    const msgs = [];
    if (system) msgs.push({ role: "system", content: system });
    msgs.push(...messages);
    const reply = await chatRaw(msgs);
    return { configured: true, reply };
  } catch (e) {
    return {
      configured: true,
      error: true,
      reply: "The AI provider returned an error. Please verify your OPENROUTER_API_KEY / model and try again.",
      detail: e.response?.data?.error?.message || e.message,
    };
  }
}

// Structured generation with graceful fallback provided by caller.
async function generateJSON({ system, prompt, fallback }) {
  if (!isConfigured()) return { configured: false, data: fallback };
  try {
    const text = await chatRaw(
      [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      { json: true, maxTokens: 2000 }
    );
    const data = extractJSON(text);
    return { configured: true, data: data || fallback, raw: text };
  } catch (e) {
    return { configured: true, error: true, data: fallback, detail: e.response?.data?.error?.message || e.message };
  }
}

module.exports = { isConfigured, chat, generateJSON, NOT_CONFIGURED_MSG };
