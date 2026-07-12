import { buildInterviewPrompt } from "../prompts/prompts.js";
import { getJsonCompletion } from "../services/openai.service.js";

/**
 * POST /api/interview
 * body: { topic, role, numQuestions }
 */
export async function handleInterview(req, res) {
  const { topic, role, numQuestions } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "topic is required" });
  }

  try {
    const messages = buildInterviewPrompt({
      topic,
      role: role || "SDE",
      numQuestions: Math.min(Number(numQuestions) || 5, 15),
    });
    const result = await getJsonCompletion(messages);
    res.json(result);
  } catch (err) {
    console.error("[interview.controller]", err);
    res.status(500).json({ error: "Failed to generate interview questions" });
  }
}
