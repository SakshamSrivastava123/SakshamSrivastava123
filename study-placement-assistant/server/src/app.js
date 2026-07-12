import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import extraRoutes from "./routes/notes.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "studymate-server" });
});

app.use("/api/chat", chatRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api", extraRoutes); // -> /api/notes, /api/summary

// fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// centralized error handler
app.use((err, req, res, next) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
