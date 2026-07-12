import { buildQuizPrompt } from "../prompts/prompts.js";
import { getJsonCompletion } from "../services/openai.service.js";

/**
 * POST /api/quiz
 * body: { topic, difficulty, numQuestions }
 */
export async function handleQuiz(req, res) {
  const { topic, difficulty, numQuestions } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "topic is required" });
  }

  try {
    const messages = buildQuizPrompt({
      topic,
      difficulty: difficulty || "medium",
      numQuestions: Math.min(Number(numQuestions) || 5, 15), // cap to keep cost/latency sane
    });
    const quiz = await getJsonCompletion(messages);
    res.json(quiz);
  } catch (err) {
    console.error("[quiz.controller]", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
}
