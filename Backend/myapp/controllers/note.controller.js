import Note from "../models/note.model.js";

export const createNotes = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        const newNote = new Note({ title, content });
        await newNote.save();
        res.status(201).json({ message: "Note created successfully", note: newNote }); 
    } catch (error) {
        res.status(500).json({ message: "OOps! Something went wrong", error: error.message });
    }
}

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
       
        res.status(200).json({ message: "Notes fetched successfully", notes: notes });
    } catch (error) {
        res.status(500).json({ message: "OOps! Something went wrong", error: error.message });
    }
}

export const updateNote = async (req, res) => { 
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not updated" });
        }
        res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    } catch (error) {
        res.status(500).json({ message: "OOps! Something went wrong", error: error.message });  
    }
} 

export const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully", note: deletedNote });
    } catch (error) {
        res.status(500).json({ message: "OOps! Something went wrong", error: error.message });
    }
}
