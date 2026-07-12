/**
 * Prompt Engineering — Person 4
 * -------------------------------------------------------------
 * Every function returns an array of chat messages ([{role, content}])
 * ready to hand to the OpenAI Chat Completions API.
 *
 * Keep prompts here (not scattered in controllers) so it's a single
 * file to tune for quality — add few-shot examples, adjust tone,
 * tighten formatting, etc.
 */

const SYSTEM_PERSONA = `You are StudyMate, an AI tutor for engineering students preparing for
college exams and placement interviews. Your subjects: Data Structures & Algorithms (DSA),
DBMS, Object-Oriented Programming (OOPs), Operating Systems, and quantitative Aptitude.

Rules you always follow:
- Explain in simple, plain language first — avoid jargon unless you define it immediately.
- Use short paragraphs, bullet points, and small code snippets where helpful.
- Prefer real-world analogies for abstract concepts (e.g. explain a stack using a plate tray).
- If a question is ambiguous, make a reasonable assumption and answer rather than refusing.
- Never pad answers with filler like "Great question!" — get straight to the explanation.
- Keep answers focused: a student revising before an exam wants clarity, not an essay.`;

/** Mode changes tone/depth: "beginner" = simplest possible; "interview" = concise & precise. */
function modeInstruction(mode = "beginner") {
  if (mode === "interview") {
    return "Answer as if this were asked in a technical interview: be precise, structured, " +
      "and mention time/space complexity or edge cases where relevant.";
  }
  return "Answer as if explaining to a beginner seeing this topic for the first time.";
}

export function buildChatPrompt({ question, mode = "beginner", history = [] }) {
  const messages = [{ role: "system", content: `${SYSTEM_PERSONA}\n\n${modeInstruction(mode)}` }];

  // include prior turns for context (trimmed by controller to last N turns)
  for (const turn of history) {
    messages.push({ role: turn.role, content: turn.content });
  }

  messages.push({ role: "user", content: question });
  return messages;
}

export function buildQuizPrompt({ topic, difficulty = "medium", numQuestions = 5 }) {
  const system = `${SYSTEM_PERSONA}

You are generating a quiz. Respond with ONLY valid JSON, no markdown fences, no prose,
matching exactly this shape:

{
  "topic": string,
  "difficulty": "easy" | "medium" | "hard",
  "questions": [
    {
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": number,   // 0-3
      "explanation": string     // 1-2 sentence explanation of the correct answer
    }
  ]
}`;

  const user = `Generate ${numQuestions} multiple-choice questions on the topic "${topic}" ` +
    `at "${difficulty}" difficulty, suitable for placement exam revision.`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

export function buildInterviewPrompt({ topic, role = "SDE", numQuestions = 5 }) {
  const system = `${SYSTEM_PERSONA}

You are generating technical interview questions. Respond with ONLY valid JSON, no markdown
fences, no prose, matching exactly this shape:

{
  "topic": string,
  "targetRole": string,
  "questions": [
    {
      "question": string,
      "idealAnswer": string,     // concise model answer, 2-5 sentences
      "followUp": string         // one likely interviewer follow-up question
    }
  ]
}`;

  const user = `Generate ${numQuestions} interview questions on "${topic}" as commonly asked ` +
    `for a "${role}" role at product/service-based companies, ordered from easier to harder.`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

export function buildNotesPrompt({ topic }) {
  const system = `${SYSTEM_PERSONA}

You are generating concise revision notes. Use markdown: a short intro line, then
headings/bullets covering definitions, key formulas or steps, common pitfalls, and a
"quick recall" section a student can re-read in under 2 minutes.`;

  const user = `Create revision notes for the topic "${topic}".`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

export function buildSummaryPrompt({ topic, sourceText }) {
  const system = `${SYSTEM_PERSONA}

You are summarizing study material into a compact topic summary (max ~200 words), followed
by 3 bullet "key takeaways".`;

  const user = sourceText
    ? `Summarize the following material about "${topic}":\n\n${sourceText}`
    : `Give a compact summary of the topic "${topic}" as if summarizing a textbook chapter.`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
