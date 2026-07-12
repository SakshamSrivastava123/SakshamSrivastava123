# API Contract

Base URL (local): `http://localhost:5000/api`

## POST /chat
Streams a Server-Sent Events response.

**Request body**
```json
{ "sessionId": "session_abc123", "question": "What is a stack?", "mode": "beginner" }
```
`mode`: `"beginner"` | `"interview"`

**Response** — `Content-Type: text/event-stream`, a sequence of lines:
```
data: {"token": "A "}
data: {"token": "stack "}
...
data: {"done": true}
```
On error: `data: {"error": "message"}` followed by stream end.

## GET /chat/history/:sessionId
**Response**
```json
{ "messages": [{ "role": "user", "content": "...", "feature": "chat", "createdAt": "..." }] }
```

## POST /quiz
**Request body**
```json
{ "topic": "Binary Search Trees", "difficulty": "medium", "numQuestions": 5 }
```
**Response**
```json
{
  "topic": "Binary Search Trees",
  "difficulty": "medium",
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 2,
      "explanation": "..."
    }
  ]
}
```

## POST /interview
**Request body**
```json
{ "topic": "Process Scheduling", "role": "SDE", "numQuestions": 5 }
```
**Response**
```json
{
  "topic": "Process Scheduling",
  "targetRole": "SDE",
  "questions": [
    { "question": "...", "idealAnswer": "...", "followUp": "..." }
  ]
}
```

## POST /notes
**Request body:** `{ "topic": "Normalization in DBMS" }`
**Response:** `{ "topic": "...", "notes": "markdown text" }`

## POST /summary
**Request body:** `{ "topic": "OS Deadlocks", "sourceText": "optional pasted material" }`
**Response:** `{ "topic": "...", "summary": "text" }`

## GET /health
**Response:** `{ "status": "ok", "service": "studymate-server" }`

## Error shape (all endpoints)
```json
{ "error": "human-readable message" }
```
