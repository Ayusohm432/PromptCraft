import React, { useState } from 'react';
import axios from 'axios';
import { Play, Plus, Loader, ChevronDown } from 'lucide-react';
import EvaluationPanel from './EvaluationPanel';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

function PromptPlayground() {
  const [taskType, setTaskType] = useState('Summarization');
  const [prompts, setPrompts] = useState(['']); // Array of prompts for side-by-side
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePromptChange = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const addPromptVariation = () => {
    if (prompts.length < 3) {
      setPrompts([...prompts, '']);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResponses(new Array(prompts.length).fill(null));

    const promises = prompts.map((prompt) => 
      axios.post(`${API_BASE}/generate`, {
        prompt: prompt,
        task_type: taskType,
        provider: 'gemini'
      })
    );

    try {
      const results = await Promise.all(promises);
      setResponses(results.map(res => res.data.response));
    } catch (error) {
      console.error("Error generating response", error);
      setResponses(new Array(prompts.length).fill("Error connecting to backend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Interactive Playground</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ color: 'var(--text-muted)' }}>Task Type:</label>
          <div style={{ position: 'relative' }}>
            <select 
              value={taskType} 
              onChange={(e) => setTaskType(e.target.value)}
              style={{ appearance: 'none', paddingRight: '2.5rem' }}
            >
              <option value="Summarization">Summarization</option>
              <option value="Q&A">Q&A</option>
              <option value="Sentiment Analysis">Sentiment Analysis</option>
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '1.2rem', pointerEvents: 'none', color: 'var(--primary-color)' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${prompts.length}, 1fr)`, gap: '1rem' }}>
        {prompts.map((prompt, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--primary-color)' }}>Variation {index + 1}</h3>
            <textarea 
              rows={6}
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => handlePromptChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {prompts.length < 3 && (
          <button className="btn btn-secondary" onClick={addPromptVariation}>
            <Plus size={18} /> Add Variation
          </button>
        )}
        <button 
          className="btn btn-primary" 
          onClick={handleGenerate}
          disabled={loading || prompts.some(p => p.trim() === '')}
        >
          {loading ? <Loader className="spin" size={18} /> : <Play size={18} />} Generate
        </button>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {responses.length > 0 && responses[0] !== null && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--surface-border)', paddingTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Outputs & Evaluation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${responses.length}, 1fr)`, gap: '1rem' }}>
            {responses.map((resp, index) => (
              <div key={index} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Response {index + 1}</h4>
                <p style={{ whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>{resp}</p>
                
                <EvaluationPanel prompt={prompts[index]} response={resp} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PromptPlayground;
