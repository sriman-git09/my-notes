import React, { createContext, useEffect, useState } from "react";
import {
  getNotes as getNotesApi,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
} from "../api/noteApi";
import { getProfile } from "../api/authApi";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const logout = () => {
    setToken(null);
    setUser(null);
    setNotes([]);
    localStorage.removeItem("token");
  };

  const setAuthToken = (value) => {
    if (value) {
      localStorage.setItem("token", value);
    } else {
      localStorage.removeItem("token");
    }
    setToken(value);
  };

  const loadNotes = async () => {
    try {
      const data = await getNotesApi();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);

      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  };

  const verifyToken = async () => {
    setLoading(true);

    try {
      const profile = await getProfile();
      setUser(profile);
      await loadNotes();
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setUser(null);
      setNotes([]);
      setLoading(false);
    }
  }, [token]);

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
        getNotes: loadNotes,
        createNote,
        updateNote,
        deleteNote,
        token,
        setAuthToken,
        logout,
        user,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};