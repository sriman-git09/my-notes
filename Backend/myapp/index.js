import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import noteRoutes from './routes/note.route.js';
import cors from 'cors';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express()
dotenv.config()
const port = process.env.PORT || 4002

// Database Connection Code
try {
   mongoose.connect(process.env.MONGO_URI, )
   console.log("conntected to MongoDB")
} catch (error) {
    console.log("Error connecting to MongoDB", error)
}

// Routing Middleware
app.use(express.json())
app.use(cors())
app.use("/api/v1/noteapp", noteRoutes)

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})