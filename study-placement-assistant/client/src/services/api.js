const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Streams a chat answer via Server-Sent Events.
 * onToken(text) fires for every chunk; onDone() fires once the stream ends.
 */
export async function streamChat({ sessionId, question, mode }, onToken, onDone, onError) {
  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, question, mode }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop(); // keep incomplete chunk for next read

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = JSON.parse(line.slice(5).trim());

        if (payload.error) {
          onError?.(payload.error);
        } else if (payload.done) {
          onDone?.();
        } else if (payload.token) {
          onToken(payload.token);
        }
      }
    }
  } catch (err) {
    onError?.(err.message);
  }
}

export async function generateQuiz({ topic, difficulty, numQuestions }) {
  const res = await fetch(`${BASE_URL}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, difficulty, numQuestions }),
  });
  if (!res.ok) throw new Error("Failed to generate quiz");
  return res.json();
}

export async function generateInterviewQuestions({ topic, role, numQuestions }) {
  const res = await fetch(`${BASE_URL}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, role, numQuestions }),
  });
  if (!res.ok) throw new Error("Failed to generate interview questions");
  return res.json();
}

export async function fetchHistory(sessionId) {
  const res = await fetch(`${BASE_URL}/chat/history/${sessionId}`);
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}
