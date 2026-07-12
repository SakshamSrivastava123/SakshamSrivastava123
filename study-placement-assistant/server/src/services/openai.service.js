import OpenAI from "openai";

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set. Add it to server/.env");
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Streams a chat completion, calling onToken(chunk) for every text delta.
 * Used by /api/chat so the frontend can render text as it arrives.
 */
export async function streamChatCompletion(messages, onToken) {
  const openai = getClient();
  const stream = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.4,
    stream: true,
  });

  let fullText = "";
  for await (const part of stream) {
    const delta = part.choices?.[0]?.delta?.content || "";
    if (delta) {
      fullText += delta;
      onToken(delta);
    }
  }
  return fullText;
}

/**
 * Non-streaming call that expects the model to return JSON (used for
 * quiz / interview generation, where the frontend needs a parsed structure
 * rather than a token stream).
 */
export async function getJsonCompletion(messages) {
  const openai = getClient();
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const raw = response.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Model did not return valid JSON: ${err.message}`);
  }
}

/** Plain (non-streaming, non-JSON) completion — used for notes/summary text. */
export async function getTextCompletion(messages) {
  const openai = getClient();
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.5,
  });
  return response.choices?.[0]?.message?.content || "";
}
