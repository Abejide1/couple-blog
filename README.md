# Couple Activities Blog

A full-stack web application for couples to track and share their activities, books, movies, and memories together.

## Features

- **Activities Section**: Track and suggest activities to do together
- **Book Section**: Share and review books you read together
- **Movie Section**: Track and review movies you watch together
- **Blog/Diary**: Shared diary entries for memorable moments

## Tech Stack

- Frontend: React with TypeScript
- Backend: Python with FastAPI
- Database: SQLite
- Styling: Tailwind CSS

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Project Structure
```
couple-activities-blog/
├── frontend/           # React TypeScript frontend
├── backend/           # FastAPI Python backend
└── README.md         # Project documentation
```
