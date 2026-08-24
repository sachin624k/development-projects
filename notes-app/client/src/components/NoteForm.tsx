import { useState } from "react";
import { createNote, updateNote } from "../services/noteService";
import type { Note } from "../types/note";

type NoteFormProps = {
  onNoteCreated: (note: Note) => void;
  onNoteUpdated: (note: Note) => void;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
};

function NoteForm({
  onNoteCreated,
  onNoteUpdated,
  editingNote,
  setEditingNote,
}: NoteFormProps) {
  const [title, setTitle] = useState(editingNote?.title ?? "");
  const [content, setContent] = useState(editingNote?.content ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNote) {
      const updatedNote = await updateNote(editingNote._id, title, content);

      onNoteUpdated(updatedNote);
      setEditingNote(null);
    } else {
      const newNote = await createNote(title, content);

      onNoteCreated(newNote);
    }

    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit">
        {editingNote ? "Update Note" : "Create Note"}
      </button>
    </form>
  );
}

export default NoteForm;
