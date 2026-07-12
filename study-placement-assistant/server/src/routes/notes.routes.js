import { Router } from "express";
import { handleNotes, handleSummary } from "../controllers/notes.controller.js";

const router = Router();

router.post("/notes", handleNotes);
router.post("/summary", handleSummary);

export default router;
