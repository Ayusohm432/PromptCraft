import React, { useState } from 'react';
import axios from 'axios';
import { Star, Save, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

function StarRating({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star}
            size={18}
            fill={star <= value ? "var(--primary-color)" : "transparent"}
            color={star <= value ? "var(--primary-color)" : "var(--surface-border)"}
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    </div>
  );
}

function EvaluationPanel({ prompt, response }) {
  const [accuracy, setAccuracy] = useState(0);
  const [relevance, setRelevance] = useState(0);
  const [coherence, setCoherence] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (accuracy === 0 && relevance === 0 && coherence === 0) {
      alert("Please rate at least one parameter (Accuracy, Relevance, or Coherence) before saving!");
      return;
    }
    
    try {
      await axios.post(`${API_BASE}/evaluations`, {
        prompt_used: prompt,
        model_response: response,
        accuracy_score: accuracy,
        relevance_score: relevance,
        coherence_score: coherence
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save evaluation", error);
      alert("Failed to save evaluation. Make sure backend is running.");
    }
  };

  return (
    <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-inner)' }}>
      <h5 style={{ marginBottom: '1rem', fontWeight: '500' }}>Rate this output</h5>
      
      <StarRating label="Accuracy" value={accuracy} onChange={setAccuracy} />
      <StarRating label="Relevance" value={relevance} onChange={setRelevance} />
      <StarRating label="Coherence" value={coherence} onChange={setCoherence} />

      <button 
        style={{ marginTop: '1rem', width: '100%' }}
        className="btn btn-secondary"
        onClick={handleSave}
      >
        {saved ? <CheckCircle size={16} color="#00ff00" /> : <Save size={16} />}
        {saved ? "Saved to Library" : "Save Evaluation"}
      </button>
    </div>
  );
}

export default EvaluationPanel;
