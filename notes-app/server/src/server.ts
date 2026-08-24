import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import noteRoutes from "./routes/note.routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 5001;

app.get("/", (_req, res) => {
  res.json({
    message: "Notes API is running",
  });
});

connectDB();

app.use("/api/notes", noteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
