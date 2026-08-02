import api from "./url";

export const createNote = async (noteData) => {
  const response = await api.post("/note/create-note", noteData);
  return response.data;
};

export const getNotes = async () => {
  const response = await api.get("/note/get-notes");
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/note/update-note/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/note/delete-note/${id}`);
  return response.data;
};