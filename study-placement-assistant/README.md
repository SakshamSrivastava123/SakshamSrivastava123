# StudyMate AI — Study & Placement Preparation Assistant

An AI-powered chatbot (MERN stack) that helps students get simple explanations for
DSA, DBMS, OOPs, Operating Systems and Aptitude topics, and generates quizzes,
interview questions, and revision notes on demand.

**Stack:** React (Vite) · Express.js · Node.js · MongoDB · OpenAI API · Docker

## 1. Project structure

```
study-placement-assistant/
├── client/                # React frontend (Person 1 & 2)
│   └── src/
│       ├── components/    # ChatWindow, MessageBubble, InputBox, FeatureButtons...
│       ├── hooks/         # useChat.js — streaming + API calls
│       └── services/      # api.js — talks to backend
├── server/                # Express backend (Person 3 & 4)
│   └── src/
│       ├── routes/        # /chat /quiz /interview
│       ├── controllers/   # request handling + validation
│       ├── services/      # openai.service.js — talks to OpenAI
│       ├── prompts/        # prompt templates for each feature
│       └── models/        # Conversation.js — MongoDB schema
├── docs/                  # Person 5 — architecture, API contract, deployment
├── docker-compose.yml      # runs client + server + mongo together
└── README.md
```

## 2. Who owns what (maps to your 5 roles)

| Person | Folder | Files to focus on |
|---|---|---|
| 1 – Frontend UI | `client/src/components/`, `client/src/styles/` | `ChatWindow.jsx`, `InputBox.jsx`, `FeatureButtons.jsx`, `App.css` |
| 2 – Frontend Logic | `client/src/hooks/`, `client/src/services/` | `useChat.js`, `api.js` |
| 3 – Backend | `server/src/routes/`, `server/src/controllers/`, `server/src/models/` | `chat.routes.js`, `chat.controller.js`, `Conversation.js` |
| 4 – AI/Prompt Engineer | `server/src/services/openai.service.js`, `server/src/prompts/` | `prompts.js` |
| 5 – Docker/AWS/Docs | `docker-compose.yml`, `client/Dockerfile`, `server/Dockerfile`, `docs/` | deployment guide, architecture diagram, report |

Everything below already runs end-to-end with placeholder logic — treat it as a
scaffold to extend, not a from-scratch build.

## 3. Local setup (without Docker)

### Backend
```bash
cd server
cp .env.example .env        # add your OPENAI_API_KEY and MONGO_URI
npm install
npm run dev                  # starts on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev                  # starts on http://localhost:5173
```

The frontend is pre-configured to call `http://localhost:5000/api/*`.

## 4. Local setup with Docker (recommended for Person 5)

```bash
cp server/.env.example server/.env   # add your real OPENAI_API_KEY
docker compose up --build
```

This starts three containers:
- `mongo` — MongoDB 7
- `server` — Express API on port 5000
- `client` — React app served via nginx on port 3000

Visit `http://localhost:3000`.

## 5. API endpoints (see docs/api-contract.md for full detail)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/chat` | Ask a doubt, get a simple explanation (streamed) |
| POST | `/api/quiz` | Generate an MCQ quiz on a topic |
| POST | `/api/interview` | Generate interview questions (+ answers) on a topic |
| GET  | `/api/chat/history/:sessionId` | Fetch conversation history |

## 6. Environment variables (`server/.env`)

```
OPENAI_API_KEY=sk-...
MONGO_URI=mongodb://mongo:27017/studymate
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
```

Never commit `.env` — only `.env.example` is tracked.

## 7. Next steps for the team

1. Person 3: swap the in-memory fallback in `Conversation.js` usage for real
   persistence once Mongo is confirmed reachable in all environments.
2. Person 4: tune `server/src/prompts/prompts.js` — this is the single file
   that controls answer quality. Add few-shot examples for tricky subjects
   (DBMS normalization, OS scheduling, etc.).
3. Person 2: `useChat.js` already handles SSE streaming — wire up retry logic
   for dropped connections.
4. Person 1: the CSS in `App.css` uses a small design-token system (see the
   `:root` variables) — adjust colors/fonts there rather than scattering styles.
5. Person 5: `docs/deployment-guide-aws.md` walks through AWS App Runner /
   ECS deployment; `docs/architecture.md` has a text-based diagram to convert
   into a proper visual for the report.
