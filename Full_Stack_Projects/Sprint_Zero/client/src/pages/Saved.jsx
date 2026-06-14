import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ExperimentCard from '../components/ExperimentCard.jsx';

export default function Saved() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const d = await api.saved();
      setItems(d.experiments);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="page">
      <h1 className="page-title display">📒 My field journal</h1>
      <p className="page-sub">Every experiment you saved, ready for your next adventure.</p>
      {loading ? (
        <p className="loading">Loading… 🧪</p>
      ) : items.length === 0 ? (
        <p className="empty">Your journal is empty — go discover an experiment, explorer! 🔭</p>
      ) : (
        <div className="grid">
          {items.map((e) => <ExperimentCard key={e.id} exp={e} onChange={load} showRemove />)}
        </div>
      )}
    </main>
  );
}
