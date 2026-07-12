import { Router } from "express";
import { handleChat, getHistory } from "../controllers/chat.controller.js";

const router = Router();

router.post("/", handleChat);
router.get("/history/:sessionId", getHistory);

export default router;
