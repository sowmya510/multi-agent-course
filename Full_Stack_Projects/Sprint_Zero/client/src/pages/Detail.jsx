import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { subjectMeta } from '../subjects.js';
import Stars from '../components/Stars.jsx';

export default function Detail() {
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setExp(await api.experiment(id));
    } catch {
      setExp(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  async function rate(stars) {
    await api.rate(id, stars);
    load();
  }
  async function clearRating() {
    await api.unrate(id);
    load();
  }
  async function toggleSave() {
    if (exp.is_saved) await api.unsave(id);
    else await api.save(id);
    load();
  }

  if (loading) return <main className="page"><p className="loading">Loading… 🧪</p></main>;
  if (!exp) return <main className="page"><p className="empty">Experiment not found.</p></main>;

  const meta = subjectMeta(exp.subject);

  return (
    <main className="page detail">
      <Link to="/" className="back">← Back to the lab</Link>
      <article className="detail-card">
        <div className="detail-hero" style={{ background: meta.color }}>
          <div className="detail-emoji">{meta.icon}</div>
          <h1>{exp.title}</h1>
          <p className="summary">{exp.summary}</p>
          <div className="badges">
            <span className="badge">{exp.subject}</span>
            <span className="badge">{exp.difficulty}</span>
            <span className="badge">⏱ {exp.time_band}</span>
            <span className="badge">💰 {exp.cost_band}</span>
          </div>
        </div>

        <div className="detail-body">
          <div className="rating-row">
            <span className="rating-label">Your rating:</span>
            <Stars value={exp.my_rating || 0} onRate={rate} />
            {exp.my_rating ? <button className="btn-ghost" onClick={clearRating}>Clear</button> : null}
            <span className="avg big">
              {exp.average_rating ? `⭐ ${exp.average_rating} (${exp.rating_count})` : '✨ Be the first to rate!'}
            </span>
          </div>

          <button className={exp.is_saved ? 'btn-saved block' : 'btn-primary block'} onClick={toggleSave}>
            {exp.is_saved ? '✓ Saved to my field journal' : '＋ Save to my field journal'}
          </button>

          <h2>🧰 What you'll need</h2>
          <ul className="materials">
            {exp.materials.map((m, i) => <li key={i}>{m}</li>)}
          </ul>

          <h2>🪄 Steps</h2>
          <ol className="steps">
            {exp.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      </article>
    </main>
  );
}
