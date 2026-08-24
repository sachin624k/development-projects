import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};

export const createNote = async (title: string, content: string) => {
  const response = await api.post("/notes", {
    title,
    content,
  });
  return response.data;
};

export const deleteNote = async (id: string) => {
  await api.delete(`/notes/${id}`);
};

export const updateNote = async (
  id: string,
  title: string,
  content: string,
) => {
  const response = await api.patch(`/notes/${id}`, {
    title,
    content,
  });
  return response.data;
};
