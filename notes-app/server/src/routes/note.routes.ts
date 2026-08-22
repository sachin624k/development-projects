import express from "express";
import {
  deleteNote,
  getNotes,
  getNotesById,
  postNotes,
  updateNotesById,
} from "../controllers/note.controller.js";

const router = express.Router();

router.get("/", getNotes);
router.post("/", postNotes);
router.get("/:id", getNotesById);
router.patch("/:id", updateNotesById);
router.delete("/:id", deleteNote);

export default router;
