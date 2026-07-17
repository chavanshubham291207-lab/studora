# Studora — All-in-One Premium Student Platform

Studora is a modern, responsive, full-stack web application designed to support students in their academic and career journeys. It features a dark/light glassmorphic SaaS interface, Framer Motion transitions, and interactive AI-driven workspace utilities.

---

## 🚀 Key Features

* **User Authentication**: Student and Admin registration and logins utilizing JWT tokens.
* **Premium Dashboard**: Progress bars, course statistics, and Recharts graphical displays (CGPA progress, Attendance tracker ratios).
* **AI Study Hub**:
  * *Doubt solver* for concept explanations.
  * *Text Summarizer* to digest textbook files.
  * *Roadmap Architect* for professional development tracks.
  * *Interactive Quiz Builder* with self-evaluating options and explanations.
* **ATS Resume Builder**: Form inputs matching industry standards, instant scoring, AI audits, and print-to-PDF selectable-text stylesheets.
* **Opportunity Hubs**: Separate directories for global Hackathons, Scholarships, and Career job listings with search tags and bookmarking options.
* **Coding Contest Tracker**: Dynamic schedules matching LeetCode, Codeforces, and CodeChef contest calendars.
* **Academic Utilities**: 
  * *CGPA/SGPA credit calculator*.
  * *Attendance counter* with 75% target warnings.
  * *Timetable visual grid planner*.
  * *Developer Portfolio reviews* (GitHub stats fetching and LinkedIn summaries audits).
* **Student Community Forum**: Post question discussions, Category search, and replies threads.
* **Admin Management Console**: Dedicated dashboard where administrators can add new opportunities, delete listings, and schedule workshops.

---

## 🛠️ Tech Stack & Architecture

- **Client (Frontend)**: React v19, Vite v8, Tailwind CSS v4, Framer Motion, Recharts, Lucide React.
- **Server (Backend)**: Node.js, Express.js, MongoDB (Mongoose ORM), JWT, Gemini AI SDK (`@google/generative-ai`).
- **Database dual-mode**: Can connect to a live MongoDB server or automatically fall back to local JSON storage files (`server/data/`) if disconnected.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js**: `v18+` or later installed.
- **npm**: `v9+` or later installed.

### 2. Environment Variables
Copy `.env.example` in the `server/` directory to create a `.env` file:
```bash
cd server
cp .env.example .env
```
Inside `.env`, configure:
- `PORT` (default is 5000)
- `MONGODB_URI` (optional; if not provided, Studora falls back to local JSON files)
- `JWT_SECRET` (default is provided)
- `GEMINI_API_KEY` (optional; if not provided, Studora runs a highly detailed simulated AI response engine)

### 3. Run the Platform
From the root workspace directory, you can run all services with one command:

To install all dependencies (client & server):
```bash
npm run install-all
```

To run both React dev server and Express API server concurrently:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend client**: `http://localhost:5173`
- **Backend server**: `http://localhost:5000`

---

## 👨‍💻 Testing Credentials
The backend automatically seeds mock data on startup if the database is empty:
- **Student Profile**:
  - Email: `student@university.edu`
  - Password: `password123`
- **Admin Profile**:
  - Email: `admin@studora.io`
  - Password: `adminpassword123`
