import Conversation from "../models/Conversation.js";
import { buildChatPrompt } from "../prompts/prompts.js";
import { streamChatCompletion } from "../services/openai.service.js";

const HISTORY_TURNS = 8; // last N messages to send back as context

/**
 * POST /api/chat
 * body: { sessionId, question, mode }
 * Streams the answer back as Server-Sent Events so the frontend can
 * render it token-by-token, ChatGPT-style.
 */
export async function handleChat(req, res) {
  const { sessionId, question, mode } = req.body;

  if (!sessionId || !question) {
    return res.status(400).json({ error: "sessionId and question are required" });
  }

  try {
    let convo = await Conversation.findOne({ sessionId });
    if (!convo) {
      convo = await Conversation.create({ sessionId, messages: [] });
    }

    const recentHistory = convo.messages.slice(-HISTORY_TURNS).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const messages = buildChatPrompt({ question, mode, history: recentHistory });

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const fullAnswer = await streamChatCompletion(messages, (delta) => {
      res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    convo.messages.push({ role: "user", content: question, feature: "chat" });
    convo.messages.push({ role: "assistant", content: fullAnswer, feature: "chat" });
    await convo.save();
  } catch (err) {
    console.error("[chat.controller]", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate a response" });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
}

/** GET /api/chat/history/:sessionId */
export async function getHistory(req, res) {
  try {
    const convo = await Conversation.findOne({ sessionId: req.params.sessionId });
    res.json({ messages: convo?.messages || [] });
  } catch (err) {
    res.status(500).json({ error: "Could not load history" });
  }
}
