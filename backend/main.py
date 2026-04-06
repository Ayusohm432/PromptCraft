from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db, Base
import models
from llm_service import generate_gemini_response

import os
import time
import threading
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def keep_alive():
    url = os.environ.get("RENDER_EXTERNAL_URL")

    # If the URL isn't set, just skip—no crash, no fuss
    if not url:
        logger.info("KeepAlive: no URL found, skipping")
        return

    logger.info(f"KeepAlive: pinging {url} every 5 minutes...")

    while True:
        try:
            requests.get(url, timeout=10)
            logger.info("KeepAlive: ping sent ✓")
        except Exception as e:
            logger.error(f"KeepAlive: something went wrong — {e}")

        time.sleep(300)  # sleep for 5 minutes, then repeat

# Start the keep-alive in a background thread (daemon=True means it
# shuts down automatically when your main app stops—no cleanup needed)
thread = threading.Thread(target=keep_alive, daemon=True)
thread.start()

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PromptCraft API")

# Configure CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to GitHub Pages URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class GenerateRequest(BaseModel):
    prompt: str
    task_type: str
    provider: str = "gemini"

class GenerateResponse(BaseModel):
    response: str

class PromptTemplateCreate(BaseModel):
    name: str
    task_type: str
    prompt_text: str

class PromptTemplateResponse(PromptTemplateCreate):
    id: int
    class Config:
        from_attributes = True

class EvaluationCreate(BaseModel):
    prompt_used: str
    model_response: str
    accuracy_score: float = None
    relevance_score: float = None
    coherence_score: float = None

# --- API Routes ---

@app.get("/")
def read_root():
    return {"message": "Welcome to PromptCraft API"}

@app.post("/api/generate", response_model=GenerateResponse)
def generate_response(req: GenerateRequest):
    if req.provider.lower() == "gemini":
        res_text = generate_gemini_response(req.prompt, req.task_type)
        return {"response": res_text}
    else:
         raise HTTPException(status_code=501, detail="Provider not implemented yet.")

@app.get("/api/prompts", response_model=List[PromptTemplateResponse])
def get_prompts(db: Session = Depends(get_db)):
    prompts = db.query(models.PromptTemplate).all()
    return prompts

@app.post("/api/prompts", response_model=PromptTemplateResponse)
def create_prompt(prompt: PromptTemplateCreate, db: Session = Depends(get_db)):
    db_prompt = models.PromptTemplate(**prompt.dict())
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

@app.post("/api/evaluations")
def save_evaluation(eval_data: EvaluationCreate, db: Session = Depends(get_db)):
    new_eval = models.EvaluationResult(**eval_data.model_dump())
    db.add(new_eval)
    db.commit()
    db.refresh(new_eval)
    return new_eval

@app.get("/api/evaluations")
def get_evaluations(db: Session = Depends(get_db)):
    evals = db.query(models.EvaluationResult).all()
    return evals
