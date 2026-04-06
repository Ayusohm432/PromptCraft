from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    task_type = Column(String) # Summarization, Q&A, Sentiment Analysis
    prompt_text = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class EvaluationResult(Base):
    __tablename__ = "evaluation_results"

    id = Column(Integer, primary_key=True, index=True)
    prompt_used = Column(String)
    model_response = Column(String)
    accuracy_score = Column(Float, nullable=True)
    relevance_score = Column(Float, nullable=True)
    coherence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
