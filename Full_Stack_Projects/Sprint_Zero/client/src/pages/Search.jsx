import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { SUBJECT_LIST, subjectMeta } from '../subjects.js';
import ExperimentCard from '../components/ExperimentCard.jsx';

const DIFFICULTIES = ['Easy', 'Intermediate', 'Advanced'];

export default function Search() {
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const d = await api.experiments({ q, subject, difficulty });
      setItems(d.experiments);
    } finally {
      setLoading(false);
    }
  }

  // Reload whenever a filter changes; keyword reloads on submit.
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [subject, difficulty]);

  function onSearch(e) {
    e.preventDefault();
    load();
  }

  function toggleSubject(s) {
    setSubject((cur) => (cur === s ? '' : s));
  }
  function toggleDifficulty(d) {
    setDifficulty((cur) => (cur === d ? '' : d));
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="hero-kicker">🧭 Science Explorer Club</p>
        <h1 className="hero-title">Find your next BIG experiment!</h1>
        <p className="hero-sub">Search the lab, discover something awesome, and save it to your field journal to try later.</p>
        <form className="search-bar" onSubmit={onSearch}>
          <input aria-label="Search experiments"
            placeholder="Try 'volcano', 'plants', or 'rainbow'…"
            value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="submit" className="btn-primary">Search 🔍</button>
        </form>
      </header>

      <p className="filter-label">Pick a science zone</p>
      <div className="subject-row">
        <button className={subject === '' ? 'subj active' : 'subj'} onClick={() => setSubject('')}
          aria-label="All subjects" aria-pressed={subject === ''}>
          <span className="subj-emoji">🌈</span> All
        </button>
        {SUBJECT_LIST.map((s) => {
          const meta = subjectMeta(s);
          const active = subject === s;
          return (
            <button key={s} className={active ? 'subj active' : 'subj'} onClick={() => toggleSubject(s)}
              aria-label={s} aria-pressed={active}
              style={active ? undefined : { borderColor: meta.color }}>
              <span className="subj-emoji">{meta.icon}</span> {s}
            </button>
          );
        })}
      </div>

      <p className="filter-label">How tricky?</p>
      <div className="difficulty-row">
        {DIFFICULTIES.map((d) => (
          <button key={d} className={difficulty === d ? 'diff active' : 'diff'} onClick={() => toggleDifficulty(d)}
            aria-label={d} aria-pressed={difficulty === d}>
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Loading experiments… 🧪</p>
      ) : items.length === 0 ? (
        <p className="empty">No experiments found — try another word, explorer! 🔍</p>
      ) : (
        <div className="grid">
          {items.map((e) => <ExperimentCard key={e.id} exp={e} onChange={load} />)}
        </div>
      )}
    </main>
  );
}
