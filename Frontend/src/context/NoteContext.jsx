import React, { createContext, useEffect, useState } from "react";
import {
  getNotes as fetchNotes,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
} from "../api/noteApi";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  const getNotes = async () => {
    setLoading(true);

    try {
      const data = await fetchNotes();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getNotes();
    } else {
      setLoading(false);
    }
  }, []);

  // Create Note
  const createNote = async (note) => {
    try {
      const data = await createNoteApi(note);

      setNotes((prevNotes) => [data.note, ...prevNotes]);

      return data;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  };

  // Update Note
  const updateNote = async (id, updatedNote) => {
    try {
      const data = await updateNoteApi(id, updatedNote);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? data.note : note
        )
      );

      return data;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await deleteNoteApi(id);

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== id)
      );
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        getNotes,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};