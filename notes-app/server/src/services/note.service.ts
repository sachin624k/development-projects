import { Note } from "../models/note.model.js";

export const getAllNotes = async () => {
  const notes = await Note.find().sort({ createdAt: -1 });
  return notes;
};

export const createNote = async (title: string, content: string) => {
  const note = await Note.create({
    title,
    content,
  });
  return note;
};

export const getNoteById = async (id: string) => {
  const note = await Note.findById(id);
  return note;
};

export const updateNoteById = async (
  id: string,
  title: string,
  content: string,
) => {
  const note = await Note.findByIdAndUpdate(
    id,
    { title, content },
    { returnDocument: "after", runValidators: true },
  );
  return note;
};

export const deleteNoteById = async (id: string) => {
  const note = await Note.findByIdAndDelete(id);
  return note
};
