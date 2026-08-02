import Note from "../models/note.model.js";

// Create Note
export const createNotes = async (req, res) => {
    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const newNote = await Note.create({
            title,
            content,
            user: req.user._id
        });

        res.status(201).json({
            message: "Note created successfully",
            note: newNote
        });

    } catch (error) {

        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });

    }
};

// Get All Notes of Logged-in User
export const getNotes = async (req, res) => {

    try {

        const notes = await Note.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Notes fetched successfully",
            notes
        });

    } catch (error) {

        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });

    }

};

// Update Note
export const updateNote = async (req, res) => {

    try {

        const { title, content } = req.body;

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        note.title = title || note.title;
        note.content = content || note.content;

        await note.save();

        res.status(200).json({
            message: "Note updated successfully",
            note
        });

    } catch (error) {

        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });

    }

};

// Delete Note
export const deleteNote = async (req, res) => {

    try {

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        await note.deleteOne();

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });

    }

};