import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { subjectMeta } from '../subjects.js';

export default function ExperimentCard({ exp, onChange, showRemove = false }) {
  const meta = subjectMeta(exp.subject);

  async function toggleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (exp.is_saved) await api.unsave(exp.id);
    else await api.save(exp.id);
    if (onChange) onChange();
  }

  const saveText = showRemove
    ? (exp.is_saved ? '✕ Remove' : '＋ Save')
    : (exp.is_saved ? '✓ Saved' : '＋ Save');

  return (
    <Link to={`/experiments/${exp.id}`} className="card">
      <div className="card-banner" style={{ background: meta.color }}>
        <span className="card-emoji">{meta.icon}</span>
        <span className="card-subject">{exp.subject}</span>
      </div>
      <div className="card-body">
        <h3>{exp.title}</h3>
        <p className="card-summary">{exp.summary}</p>
        <div className="card-meta">
          <span className="pill">{exp.difficulty}</span>
          <span className="pill ghost">⏱ {exp.time_band}</span>
        </div>
        <div className="card-foot">
          <span className="avg">{exp.average_rating ? `⭐ ${exp.average_rating}` : '✨ New!'}</span>
          <button
            className={exp.is_saved ? 'chip saved' : 'chip'}
            onClick={toggleSave}
            aria-label={exp.is_saved ? 'Remove from my list' : 'Save to my list'}
          >
            {saveText}
          </button>
        </div>
      </div>
    </Link>
  );
}
