import React from "react";
import { BrowserRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NoteProvider } from "./context/NoteContext.jsx"
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <NoteProvider>

   <App />
   </NoteProvider>
   </BrowserRouter>
  
)