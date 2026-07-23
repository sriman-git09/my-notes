import React, { createContext, useEffect, useState } from "react";
import BACKEND_URL from "../api/url";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  const getNotes = async () => {
    setLoading(true);
    try {
      const response = await BACKEND_URL.get("/get-notes");
      setNotes(response.data.notes); // <-- Fixed
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  // Create a note
  const createNote = async (note) => {
    try {
      const res = await BACKEND_URL.post("/create-note", note);
      setNotes([res.data.note, ...notes]); // <-- Fixed
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Update a note
  const updateNote = async (id, updatedNote) => {
    try {
      const res = await BACKEND_URL.put(`/update-note/${id}`, updatedNote);

      setNotes(
        notes.map((note) =>
          note._id === id ? res.data.note : note // <-- Fixed
        )
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await BACKEND_URL.delete(`/delete-note/${id}`);

      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};