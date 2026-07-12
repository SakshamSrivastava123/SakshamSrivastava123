import { useCallback, useRef, useState } from "react";
import { streamChat, generateQuiz, generateInterviewQuestions } from "../services/api.js";

function makeSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Central hook for the chat UI: owns messages, loading/error state, and
 * knows how to talk to each backend feature (chat / quiz / interview).
 * Person 1 wires this into ChatWindow/InputBox/FeatureButtons;
 * Person 2 extends this file for retries, aborts, etc.
 */
export function useChat() {
  const [messages, setMessages] = useState([]); // {role, content, feature}
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sessionIdRef = useRef(makeSessionId());

  const appendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const sendQuestion = useCallback(async (question, mode = "beginner") => {
    if (!question.trim()) return;
    setError(null);
    appendMessage({ role: "user", content: question, feature: "chat" });

    // placeholder assistant message we mutate as tokens stream in
    let assistantText = "";
    appendMessage({ role: "assistant", content: "", feature: "chat" });
    setIsLoading(true);

    await streamChat(
      { sessionId: sessionIdRef.current, question, mode },
      (token) => {
        assistantText += token;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: assistantText, feature: "chat" };
          return next;
        });
      },
      () => setIsLoading(false),
      (errMsg) => {
        setIsLoading(false);
        setError(errMsg || "Something went wrong. Please try again.");
      }
    );
  }, [appendMessage]);

  const runQuiz = useCallback(async (topic, difficulty = "medium") => {
    setIsLoading(true);
    setError(null);
    appendMessage({ role: "user", content: `Quiz me on: ${topic}`, feature: "quiz" });
    try {
      const quiz = await generateQuiz({ topic, difficulty, numQuestions: 5 });
      appendMessage({ role: "assistant", content: formatQuiz(quiz), feature: "quiz" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage]);

  const runInterview = useCallback(async (topic) => {
    setIsLoading(true);
    setError(null);
    appendMessage({ role: "user", content: `Interview questions on: ${topic}`, feature: "interview" });
    try {
      const result = await generateInterviewQuestions({ topic, role: "SDE", numQuestions: 5 });
      appendMessage({ role: "assistant", content: formatInterview(result), feature: "interview" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage]);

  return { messages, isLoading, error, sendQuestion, runQuiz, runInterview };
}

function formatQuiz(quiz) {
  if (!quiz?.questions?.length) return "Couldn't generate a quiz for that topic — try rephrasing it.";
  return quiz.questions
    .map((q, i) => {
      const opts = q.options.map((o, idx) => `   ${String.fromCharCode(65 + idx)}. ${o}`).join("\n");
      const correct = String.fromCharCode(65 + q.correctIndex);
      return `${i + 1}. ${q.question}\n${opts}\n   ✔ Answer: ${correct} — ${q.explanation}`;
    })
    .join("\n\n");
}

function formatInterview(result) {
  if (!result?.questions?.length) return "Couldn't generate interview questions — try rephrasing the topic.";
  return result.questions
    .map((q, i) => `${i + 1}. ${q.question}\n   Model answer: ${q.idealAnswer}\n   Likely follow-up: ${q.followUp}`)
    .join("\n\n");
}
