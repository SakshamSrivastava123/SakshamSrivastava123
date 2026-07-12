import { buildNotesPrompt, buildSummaryPrompt } from "../prompts/prompts.js";
import { getTextCompletion } from "../services/openai.service.js";

/** POST /api/notes  body: { topic } */
export async function handleNotes(req, res) {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  try {
    const messages = buildNotesPrompt({ topic });
    const notes = await getTextCompletion(messages);
    res.json({ topic, notes });
  } catch (err) {
    console.error("[notes.controller]", err);
    res.status(500).json({ error: "Failed to generate notes" });
  }
}

/** POST /api/summary  body: { topic, sourceText? } */
export async function handleSummary(req, res) {
  const { topic, sourceText } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  try {
    const messages = buildSummaryPrompt({ topic, sourceText });
    const summary = await getTextCompletion(messages);
    res.json({ topic, summary });
  } catch (err) {
    console.error("[notes.controller]", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
}
