# Architecture — StudyMate AI

## Text diagram (convert to a proper visual for the report)

```
┌────────────────────┐        HTTPS         ┌─────────────────────────┐
│   React Client      │ ───────────────────▶ │   Express API Server    │
│  (nginx, port 80)    │  /api/chat (SSE)     │   (Node.js, port 5000)   │
│                      │  /api/quiz            │                          │
│  - ChatWindow        │  /api/interview        │  routes → controllers  │
│  - InputBox          │  /api/notes             │  → services → OpenAI    │
│  - FeatureButtons    │◀──────────────────── │                          │
└────────────────────┘   streamed tokens /   └─────────┬───────────────┘
                          JSON responses                 │
                                                          │ mongoose
                                                          ▼
                                               ┌─────────────────────┐
                                               │      MongoDB          │
                                               │  conversations coll.  │
                                               └─────────────────────┘

Server also calls OUT to:
┌─────────────────────────┐
│   OpenAI Chat Completions │  (streaming for /chat, JSON mode for /quiz & /interview)
└─────────────────────────┘

Everything runs in 3 Docker containers (client, server, mongo) behind a
docker-compose network; in production, client + server can each be deployed
as separate services on AWS (e.g. App Runner / ECS Fargate), with MongoDB
Atlas replacing the local mongo container.
```

## Request flow: a chat question

1. User types a question in `InputBox` → `App.jsx` calls `sendQuestion()`.
2. `useChat.js` calls `streamChat()` in `services/api.js`, which POSTs to
   `/api/chat` and reads the response body as a stream.
3. `chat.controller.js` loads prior turns from MongoDB, builds a prompt via
   `prompts.js`, and calls `openai.service.js`'s `streamChatCompletion()`.
4. Each token from OpenAI is written back to the client as an SSE `data:` line.
5. Once done, the full question + answer are saved to the `Conversation`
   document for that session.

## Request flow: quiz / interview generation

Same routing shape, but non-streaming: the controller asks OpenAI for a
single JSON-mode completion (`response_format: json_object`) and returns the
parsed object directly — no persistence needed unless you want a "past quizzes"
feature later.

## Why this shape

- **Separation of concerns**: prompts live in one file (`prompts/prompts.js`)
  so Person 4 can iterate on wording without touching routing code.
- **Streaming isolated to `openai.service.js`**: if you swap models or add
  retries/rate-limit handling, it's one place to change.
- **Stateless frontend**: all conversation state lives server-side keyed by
  `sessionId`, so the UI can be safely refreshed without losing context (once
  history-fetch-on-load is wired up).
