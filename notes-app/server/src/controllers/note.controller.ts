import { Request, Response } from "express";
import {
  createNote,
  deleteNoteById,
  getAllNotes,
  getNoteById,
  updateNoteById,
} from "../services/note.service.js";

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};

export const postNotes = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const note = await createNote(title, content);

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create a note",
    });
  }
};

export const getNotesById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const note = await getNoteById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch note",
    });
  }
};

export const updateNotesById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { title, content } = req.body;

    const note = await updateNoteById(req.params.id, title, content);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update note",
    });
  }
};

export const deleteNotesById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    // const { id } = req.params;
    const deletedNote = await deleteNoteById(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};
