import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "./services/noteService";
import type { Note } from "./types/note";
import NoteForm from "./components/NoteForm";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleNoteCreated = (newNote: Note) => {
    setNotes((currentNotes) => [newNote, ...currentNotes]);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    setNotes((currentNotes) => currentNotes.filter((note) => note._id !== id));
  };

  const handleNoteUpdated = (updatedNote: Note) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note,
      ),
    );
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setError("");

        const data = await getNotes();
        setNotes(data);
      } catch {
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <NoteForm
        key={editingNote?._id ?? "new"}
        onNoteCreated={handleNoteCreated}
        onNoteUpdated={handleNoteUpdated}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
      />
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error ? (
        <p>{error}</p>
      ) : loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div>
          {filteredNotes.map((note) => (
            <div key={note._id}>
              <h2>{note.title}</h2>
              <p>{note.content}</p>

              <button
                onClick={() => {
                  setEditingNote(note);
                }}
              >
                Edit
              </button>

              <button onClick={() => handleDelete(note._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
