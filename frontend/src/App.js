import { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState(7);
  const [level, setLevel] = useState('beginner');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const levels = [
    { value: 'beginner', label: '🌱 Beginner' },
    { value: 'intermediate', label: '⚡ Intermediate' },
    { value: 'advanced', label: '🔥 Advanced' },
  ];

  const generatePlan = async () => {
    setLoading(true);
    setPlan('');
    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, days, level })
      });
      const data = await response.json();
      setPlan(data.plan);
    } catch (error) {
      setPlan('Something went wrong. Is your backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="app">

      <div className="hero">
        <div className="badge">✦ AI Powered</div>
        <h1>Your Personal<br /><span className="gradient-text">Study Planner</span></h1>
        <p className="subtitle">Tell us what you want to learn — we'll build the perfect roadmap for you.</p>
      </div>

      <div className="form-section">

        <div className="card">
          <label className="input-label">WHAT DO YOU WANT TO LEARN?</label>
          <input
            type="text"
            placeholder="e.g. Python, React, Machine Learning, DSA..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="card">
          <div className="slider-row">
            <label className="input-label" style={{ margin: 0 }}>HOW MANY DAYS?</label>
            <span className="days-badge">{days} Days</span>
          </div>
          <input
            type="range" min="3" max="60"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          <div className="slider-labels">
            <span>3 days</span>
            <span>1 month</span>
            <span>2 months</span>
          </div>
        </div>

        <div className="card">
          <label className="input-label">YOUR CURRENT LEVEL</label>
          <div className="level-grid">
            {levels.map((l) => (
              <div
                key={l.value}
                className={`level-btn ${level === l.value ? 'active' : ''}`}
                onClick={() => setLevel(l.value)}
              >
                <span className="level-icon">{l.label.split(' ')[0]}</span>
                <span className="level-text">{l.label.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="generate-btn"
          onClick={generatePlan}
          disabled={!topic || loading}
        >
          {loading
            ? <span className="btn-inner">⏳ Building your roadmap...</span>
            : <span className="btn-inner">🚀 Generate Study Plan <span className="arrow">→</span></span>
          }
        </button>

      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="loading-text">AI is crafting your personalized roadmap...</p>
        </div>
      )}

      {plan && !loading && (
        <div className="result-card">
          <div className="result-header">
            <div className="result-header-left">
              <div className="result-icon">✦</div>
              <div>
                <p className="result-label">YOUR ROADMAP</p>
                <p className="result-title">{topic} — {days} Day Plan</p>
              </div>
            </div>
            <span className={`level-tag ${level}`}>{level}</span>
          </div>
          <div className="divider"></div>
          <pre className="result-pre">{plan}</pre>
          <div className="result-footer">
            <p>🎯 Follow this plan consistently and you'll see real progress.</p>
          </div>
        </div>
      )}

      <div className="footer">
        <p>Built with React + Python + AI · Your study companion</p>
      </div>

    </div>
  );
}

export default App;