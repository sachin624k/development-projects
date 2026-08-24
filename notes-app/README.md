# Notes App — Full Stack Notes Manager

A practical full-stack **Notes** application built to learn how a **React frontend** communicates with a structured **Node.js / Express backend** and a **MongoDB database**.

The project focuses on learning by building: **understand the concept → implement it → debug it → move forward.**

---

## Features

- Create notes
- View all notes
- View a single note
- Edit notes
- Delete notes
- Search notes by title
- Loading state
- Error state
- Empty state
- Form reuse for Create/Edit
- REST API architecture
- Controller + Service layer
- TypeScript on frontend and backend
- MongoDB persistence

---

## Tech Stack

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| React        | Frontend UI                |
| TypeScript   | Type safety                |
| Axios        | Frontend API communication |
| Node.js      | Backend runtime            |
| Express.js   | REST API                   |
| MongoDB      | Database                   |
| Mongoose     | MongoDB ODM                |
| Tailwind CSS | Frontend styling           |
| Vite         | Frontend tooling           |

---

## Project Structure

```
notes-app/
├── client/
│   └── src/
│       ├── components/
│       │   └── NoteForm.tsx
│       ├── services/
│       │   └── noteService.ts
│       ├── types/
│       │   └── note.ts
│       ├── App.tsx
│       └── main.tsx
│
└── server/
    └── src/
        ├── config/
        │   └── db.ts
        ├── controllers/
        │   └── note.controller.ts
        ├── models/
        │   └── note.model.ts
        ├── routes/
        │   └── note.routes.ts
        ├── services/
        │   └── note.service.ts
        └── server.ts
```

---

## ▶Quick Start

### 1. Start Backend

```bash
cd server
npm install
npm run dev
```

Backend runs at: `http://localhost:5001`

Create `server/.env`:

```
MONGO_URI=your_mongodb_connection_string
```

### 2. Start Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API

| Method | Endpoint         | Purpose       |
| ------ | ---------------- | ------------- |
| GET    | `/api/notes`     | Get all notes |
| POST   | `/api/notes`     | Create note   |
| GET    | `/api/notes/:id` | Get one note  |
| PATCH  | `/api/notes/:id` | Update note   |
| DELETE | `/api/notes/:id` | Delete note   |

---

## Architecture

```
React UI
   ↓
Axios Service
   ↓
Express Route
   ↓
Controller
   ↓
Service
   ↓
Mongoose
   ↓
MongoDB
```

**Responsibilities**

- **Routes** → define API endpoints
- **Controllers** → handle HTTP request/response
- **Services** → handle database/business operations
- **Models** → define MongoDB document structure
- **Axios service** → communicate with backend
- **React components** → handle UI and user interaction

---

## Building the Backend (Step by Step)

### 1. Project Setup

```bash
mkdir notes-app && cd notes-app
mkdir client server
npm create vite@latest client -- --template react-ts
cd server && npm init -y
```

### 2. Install Backend Packages

```bash
npm install express mongoose cors dotenv
npm install -D typescript tsx @types/node @types/express @types/cors
npx tsc --init
```

- `express` → server + API routes
- `mongoose` → MongoDB connection/modeling
- `cors` → allows frontend ↔ backend communication
- `dotenv` → loads `.env` into `process.env`
- `tsx` → runs TypeScript files directly during dev

### 3. Configure TypeScript

Replace `server/tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

In `server/package.json`, add `"type": "module"` so `import` syntax works instead of `require()`.

Add scripts:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### 4. Create the Express Server

`server/src/server.ts`:

```ts
import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json()); // parses incoming JSON into req.body

app.get("/", (_req, res) => {
  res.json({ message: "Notes API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 5. Connect MongoDB

Create `server/.env`:

```
MONGO_URI=your_mongodb_connection_string
```

Create `server/src/config/db.ts`:

```ts
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
```

> The `!` is a **TypeScript non-null assertion** — it tells TypeScript "I know this value exists," since `process.env.MONGO_URI` is normally `string | undefined`. It does **not** load or create the variable — `MONGO_URI` must actually exist in `.env`.

In `server.ts`, load env vars and connect before `app.listen()`:

```ts
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
connectDB();
```

### 6. Create the Note Model

`server/src/models/note.model.ts`:

```ts
import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export const Note = mongoose.model("Note", noteSchema);
```

### 7. Build the Routes

`server/src/routes/note.routes.ts`:

```ts
import express from "express";
import { Note } from "../models/note.model.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

export default router;
```

Mount it in `server.ts`:

```ts
import noteRoutes from "./routes/note.routes.js";
app.use("/api/notes", noteRoutes);
```

The same pattern was repeated to build:

- `GET /api/notes/:id` — get a single note by its MongoDB `_id`
- `PATCH /api/notes/:id` — update a note
- `DELETE /api/notes/:id` — delete a note

**Understanding `findByIdAndUpdate()`**

```ts
Note.findByIdAndUpdate(
  req.params.id, // WHICH note?
  { title, content }, // CHANGE WHAT?
  { new: true, runValidators: true },
);
```

- `new: true` → return the **updated** document instead of the old one
- `runValidators: true` → re-apply schema validation rules (e.g. `required: true`) during the update

### 8. Refactor Routes → Controllers

As the app grows, database/business logic shouldn't live inside route files.

`server/src/controllers/note.controller.ts`:

```ts
import { Request, Response } from "express";
import { Note } from "../models/note.model.js";

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// getNote, createNote, updateNote, deleteNote follow the same pattern
```

Routes then just point to controllers:

```ts
router.get("/", getNotes);
```

### 9. Add a Service Layer

`server/src/services/note.service.ts` — moves the raw Mongoose calls out of the controllers:

```ts
import { Note } from "../models/note.model.js";

export const getAllNotes = () => Note.find().sort({ createdAt: -1 });
export const createNote = (data: { title: string; content: string }) =>
  Note.create(data);
export const getNoteById = (id: string) => Note.findById(id);
export const updateNote = (id: string, data: object) =>
  Note.findByIdAndUpdate(id, data, { new: true, runValidators: true });
export const deleteNote = (id: string) => Note.findByIdAndDelete(id);
```

**Final API flow:**

```
GET     /api/notes       → getNotes       → getAllNotes()
POST    /api/notes       → createNote     → createNote()
GET     /api/notes/:id   → getNoteById    → getNoteById()
PATCH   /api/notes/:id   → updateNote     → updateNote()
DELETE  /api/notes/:id   → deleteNote     → deleteNote()
```

---

## Building the Frontend (Step by Step)

### 1. Frontend Structure

Inside `client/src/`, create:

```
components/
services/
types/
```

### 2. Note Type

`client/src/types/note.ts`:

```ts
export type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
```

### 3. Axios Service

```bash
cd client
npm install axios
```

`client/src/services/noteService.ts`:

```ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};
```

A single Axios instance avoids repeating the base URL in every request (`api.get("/notes")`, `api.post("/notes")`, `api.delete("/notes/:id")`).

### 4. Fetch Notes into React

`client/src/App.tsx`:

```tsx
import { useEffect, useState } from "react";
import { getNotes } from "./services/noteService";
import type { Note } from "./types/note";

const [notes, setNotes] = useState<Note[]>([]);

useEffect(() => {
  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };
  fetchNotes();
}, []);
```

- `notes` → current notes, `setNotes` → updates them, `Note[]` → array of notes, `[]` → initially empty.
- The **dependency array** (`[]`) controls when the effect re-runs:
  - `[]` → run once, on initial mount
  - `[name]` → run when `name` changes
  - `[a, b]` → run when `a` or `b` changes

Here, `[]` means: _fetch notes once, when the App first loads._

The same Axios-service pattern (`createNote`, `updateNote`, `deleteNote`) was then used to wire up Create, Edit, and Delete from the UI.

---

## What I Learned

### Backend

- Express server setup
- Middleware (`express.json()`)
- REST API routes
- MongoDB connection with Mongoose
- Mongoose schemas and models
- CRUD operations
- `findByIdAndUpdate()`
- Request params vs. request body
- Controllers
- Service layer
- TypeScript with Express

### Frontend

- React state with `useState`
- API calls with Axios
- `useEffect` and dependency arrays
- TypeScript types
- Props and callback functions
- Parent → Child communication
- Child → Parent state updates
- Conditional rendering
- Controlled inputs
- Form handling
- `map()`, `filter()`
- Spread operator
- Loading, error, and empty states
- Search/filtering
- Reusing one form for Create and Edit

---

## Important React Patterns

**Parent → Child**

```
App
 ↓ props
NoteForm
```

**Child → Parent**

```
NoteForm
 ↓ callback
App state
 ↓
React re-renders
```

**Create**

```
Form
 ↓
POST
 ↓
MongoDB
 ↓
new note
 ↓
setNotes()
 ↓
UI updates
```

**Edit**

```
Click Edit
 ↓
editingNote
 ↓
Form receives selected note
 ↓
PATCH
 ↓
updated note
 ↓
replace matching note in state
 ↓
UI updates
```

**Delete**

```
DELETE
 ↓
MongoDB
 ↓
filter() matching note out of state
 ↓
UI updates
```

---

## Goal

The goal of this project is not just to build a Notes CRUD app — it's to understand the **complete flow**:

```
User Action
   ↓
React State
   ↓
Axios
   ↓
REST API
   ↓
Controller
   ↓
Service
   ↓
MongoDB
   ↓
Response
   ↓
React State
   ↓
UI
```

**Build → Face a problem → Understand why → Fix it → Move to the next feature.**

---

## Author

**Sachin Kushwaha**

Built as part of a practical full-stack development learning journey.
