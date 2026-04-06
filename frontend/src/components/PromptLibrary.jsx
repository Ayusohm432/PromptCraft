import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Database, Search } from 'lucide-react';

const API_BASE = "http://localhost:8000/api";

function PromptLibrary() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await axios.get(`${API_BASE}/evaluations`);
        setEvaluations(res.data);
      } catch (error) {
        console.error("Error fetching library", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const filtered = evaluations.filter(ev => 
    ev.prompt_used.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ev.model_response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel" style={{ minHeight: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database color="var(--secondary-color)" />
          <h2>Evaluation History & Library</h2>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search prompts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading library...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p>No evaluations found. Start testing prompts in the Playground to see them here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(ev => (
            <div key={ev.id} style={{ 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <strong style={{ color: 'var(--primary-color)' }}>Prompt:</strong>
                <p style={{ marginTop: '0.5rem', background: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-inner)' }}>
                  {ev.prompt_used}
                </p>
              </div>
              
              <div>
                <strong style={{ color: 'var(--secondary-color)' }}>Response:</strong>
                <p style={{ marginTop: '0.5rem', background: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-inner)' }}>
                  {ev.model_response}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                <span><strong>Accuracy:</strong> {ev.accuracy_score || 0}/5</span>
                <span><strong>Relevance:</strong> {ev.relevance_score || 0}/5</span>
                <span><strong>Coherence:</strong> {ev.coherence_score || 0}/5</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                  {new Date(ev.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PromptLibrary;
