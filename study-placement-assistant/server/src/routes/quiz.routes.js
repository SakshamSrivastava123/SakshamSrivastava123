import { Router } from "express";
import { handleQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.post("/", handleQuiz);

export default router;
