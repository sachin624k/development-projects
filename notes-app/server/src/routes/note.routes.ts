import express from "express";
import { Note } from "../models/note.model.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create a note",
    });
  }
});

export default router;
