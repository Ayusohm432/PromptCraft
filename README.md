# PromptCraft – Prompt Engineering & LLM Evaluation Toolkit

PromptCraft is a full-stack web application designed to help users test, optimize, and evaluate prompts for Large Language Models (LLMs). Built with a modern, glassmorphic React frontend and a FastAPI backend.

## Features
- **Prompt Playground:** Input custom prompts with variable task types (Summarization, Q&A, Sentiment Analysis).
- **A/B Testing:** Compare up to 3 variations of prompts side-by-side.
- **Evaluation Engine:** Manually rate outputs on Accuracy, Relevance, and Coherence.
- **Prompt Library:** A repository to review saved evaluations and responses.

## Tech Stack
- **Frontend:** React, Vite, Lucide Icons (Styling: Custom Glassmorphic Premium UI)
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite (Default), Google Generative AI (Gemini)

## Local Development Setup

### Backend
1. Navigate to the `backend` directory.
2. It's recommended to create a virtual environment: `python -m venv venv` and activate it.
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file in the `backend` directory and add your key: 
   `GEMINI_API_KEY=your_gemini_api_key_here`
5. Run the server: `uvicorn main:app --reload`
The API will run on `http://localhost:8000`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
The React application will run on `http://localhost:5173`.

## Deployment Instructions

### Backend (Render)
1. Commit this repository to GitHub.
2. Create a new Web Service on Render, connect your repository.
3. Set the Root Directory to `backend`.
4. Under "Environment", add an Environment Variable: `GEMINI_API_KEY` set to your API key.
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (GitHub Pages)
1. Update `API_BASE` in the frontend components (e.g., `PromptPlayground.jsx`, `PromptLibrary.jsx`) to point to your deployed Render URL.
2. Run `npm run build` in the `frontend` directory.
3. Deploy the `dist` folder to GitHub Pages using the `gh-pages` branch or via GitHub Actions.
