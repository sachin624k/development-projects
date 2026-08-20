import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 5001;

app.get("/", (_req, res) => {
  res.json({
    message: "Notes API is running",
  });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
