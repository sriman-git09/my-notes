import React, { useContext, useState } from 'react'
import { NoteContext } from '../context/NoteContext'
import jsPDF from 'jspdf'

function Notecard({note}) {
    const {deleteNote,updateNote}=useContext(NoteContext)
    const [isEditing,setIsEditing]=useState(false)
    const [editData,setEditData]=useState({
        title:note.title,
        content:note.content
    })

    const handleUpdate=()=>{
        updateNote(note._id,editData)
        setIsEditing(false)
    }

    const downloadPDF = () => {
      try {
        const doc = new jsPDF()

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 20

        const titleFontSize = 16
        const dateFontSize = 10
        const contentFontSize = 12

        // Sanitize filename
        let filename = (note.title || '').replace(/[\\/:*?"<>|]/g, '')
        filename = filename.trim().replace(/\s+/g, '_')
        if (!filename) filename = 'note'
        if (filename.length > 100) filename = filename.slice(0, 100)
        filename = filename + '.pdf'

        // Title
        doc.setFontSize(titleFontSize)
        const maxWidth = pageWidth - margin * 2
        const titleText = note.title || ''
        const titleLines = doc.splitTextToSize(titleText, maxWidth)

        let y = margin
        if (titleLines.length) {
          doc.setFont(undefined, 'bold')
          doc.text(titleLines, margin, y)
          y += titleLines.length * (titleFontSize * 1.15)
          doc.setFont(undefined, 'normal')
        }

        // Date
        const dateStr = note.createdAt
          ? new Date(note.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          : ''
        if (dateStr) {
          doc.setFontSize(dateFontSize)
          doc.text(dateStr, margin, y + 6)
          y += dateFontSize * 1.8
        }

        // Content
        doc.setFontSize(contentFontSize)
        const contentText = note.content || ''
        const contentLines = doc.splitTextToSize(contentText, maxWidth)
        const lineHeight = contentFontSize * 1.15

        for (let i = 0; i < contentLines.length; i++) {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage()
            y = margin
            doc.setFontSize(contentFontSize)
          }
          doc.text(String(contentLines[i]), margin, y)
          y += lineHeight
        }

        doc.save(filename)
      } catch (err) {
        // fail silently; don't break existing UI
        console.error('PDF generation failed', err)
      }
    }
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col overflow-hidden min-w-0">
      {isEditing ? (
        <>
          {/* Edit Mode */}
          <input
            type="text"
            className="border rounded-lg p-2 w-full mb-3 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <textarea
            className="border rounded-lg p-2 w-full mb-3 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white"
            rows="3"
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* View Mode */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {note.title}
          </h2>
          <p
            className="text-gray-600 dark:text-gray-300 mt-2 flex-1 min-w-0 overflow-hidden whitespace-pre-wrap"
            style={{
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {note.content}
          </p>

          {/* Footer: date + actions */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              {new Date(note.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={downloadPDF}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
              >
                Download
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(note._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Notecard