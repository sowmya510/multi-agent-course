// Lab Quest API — Express server implementing docs/api-contract.md exactly.
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db, initSchema } = require('./db');
const { signToken, authMiddleware, publicUser, ratingAggregate, serializeExperiment } = require('./helpers');

initSchema();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health check / base URL.
app.get('/', (req, res) => res.json({ ok: true, service: 'lab-quest-api' }));

// ----- Auth -----

app.post('/auth/signup', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'invalid_input', message: 'Email and password are required.' });
  }
  const normalized = String(email).toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalized);
  if (existing) {
    return res.status(409).json({ error: 'email_taken', message: 'That email is already taken.' });
  }
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?,?,?,?)')
    .run(id, normalized, password_hash, created_at);
  const user = { id, email: normalized, created_at };
  res.status(201).json({ access_token: signToken(id), user });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'invalid_input', message: 'Email and password are required.' });
  }
  const normalized = String(email).toLowerCase().trim();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(normalized);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'invalid_credentials', message: 'Email or password is incorrect.' });
  }
  res.json({ access_token: signToken(row.id), user: publicUser(row) });
});

app.get('/auth/me', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!row) return res.status(401).json({ error: 'unauthorized', message: 'Missing or invalid token.' });
  res.json({ user: publicUser(row) });
});

// ----- Experiments -----

app.get('/experiments', authMiddleware, (req, res) => {
  const { q, subject, difficulty, time_band, cost_band } = req.query;
  let sql = 'SELECT * FROM experiments WHERE 1=1';
  const params = [];
  if (subject) { sql += ' AND subject = ?'; params.push(subject); }
  if (difficulty) { sql += ' AND difficulty = ?'; params.push(difficulty); }
  if (time_band) { sql += ' AND time_band = ?'; params.push(time_band); }
  if (cost_band) { sql += ' AND cost_band = ?'; params.push(cost_band); }
  if (q) {
    sql += ' AND (LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(subject) LIKE ?)';
    const like = `%${String(q).toLowerCase()}%`;
    params.push(like, like, like);
  }
  sql += ' ORDER BY title';
  const rows = db.prepare(sql).all(...params);
  res.json({ experiments: rows.map((r) => serializeExperiment(r, req.user.id)) });
});

app.get('/experiments/:id', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT * FROM experiments WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not_found', message: 'Experiment not found.' });
  res.json(serializeExperiment(row, req.user.id, { full: true }));
});

// ----- Ratings -----

app.put('/experiments/:id/rating', authMiddleware, (req, res) => {
  const { stars } = req.body || {};
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'invalid_input', message: 'Stars must be an integer from 1 to 5.' });
  }
  const exp = db.prepare('SELECT id FROM experiments WHERE id = ?').get(req.params.id);
  if (!exp) return res.status(404).json({ error: 'not_found', message: 'Experiment not found.' });
  db.prepare(`INSERT INTO ratings (user_id, experiment_id, stars, created_at) VALUES (?,?,?,?)
              ON CONFLICT(user_id, experiment_id) DO UPDATE SET stars = excluded.stars`)
    .run(req.user.id, req.params.id, stars, new Date().toISOString());
  const agg = ratingAggregate(req.params.id);
  res.json({ experiment_id: req.params.id, my_rating: stars, ...agg });
});

app.delete('/experiments/:id/rating', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM ratings WHERE user_id = ? AND experiment_id = ?').run(req.user.id, req.params.id);
  const agg = ratingAggregate(req.params.id);
  res.json({ experiment_id: req.params.id, my_rating: null, ...agg });
});

// ----- Saved list -----

app.get('/saved', authMiddleware, (req, res) => {
  const rows = db.prepare(`SELECT e.*, s.saved_at AS _saved_at
                           FROM saved_items s JOIN experiments e ON e.id = s.experiment_id
                           WHERE s.user_id = ? ORDER BY s.saved_at DESC`).all(req.user.id);
  res.json({ experiments: rows.map((r) => serializeExperiment(r, req.user.id, { savedAt: r._saved_at })) });
});

app.post('/saved', authMiddleware, (req, res) => {
  const { experiment_id } = req.body || {};
  const exp = db.prepare('SELECT id FROM experiments WHERE id = ?').get(experiment_id);
  if (!exp) return res.status(404).json({ error: 'not_found', message: 'Experiment not found.' });
  const existing = db.prepare('SELECT saved_at FROM saved_items WHERE user_id = ? AND experiment_id = ?')
    .get(req.user.id, experiment_id);
  let saved_at;
  if (existing) {
    saved_at = existing.saved_at; // idempotent: no duplicate row
  } else {
    saved_at = new Date().toISOString();
    db.prepare('INSERT INTO saved_items (user_id, experiment_id, saved_at) VALUES (?,?,?)')
      .run(req.user.id, experiment_id, saved_at);
  }
  res.status(201).json({ experiment_id, is_saved: true, saved_at });
});

app.delete('/saved/:experimentId', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM saved_items WHERE user_id = ? AND experiment_id = ?')
    .run(req.user.id, req.params.experimentId);
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Lab Quest API on http://localhost:${PORT}`));
}

module.exports = app;
