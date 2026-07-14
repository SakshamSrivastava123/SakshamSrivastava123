import OpenAI from "openai";

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set. Add it to server/.env");
    }

    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  return client;
}

const MODEL =
  process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/**
 * Streaming chat completion
 */
export async function streamChatCompletion(messages, onToken) {
  const client = getClient();

  const stream = await client.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
  });

  let fullText = "";

  for await (const chunk of stream) {
    const text = chunk.choices?.[0]?.delta?.content || "";

    if (text) {
      fullText += text;
      onToken(text);
    }
  }

  return fullText;
}

/**
 * JSON completion
 */
export async function getJsonCompletion(messages) {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      ...messages,
      {
        role: "system",
        content: "Return only valid JSON. No markdown.",
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Normal text completion
 */
export async function getTextCompletion(messages) {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
  });

  return response.choices[0].message.content;
}