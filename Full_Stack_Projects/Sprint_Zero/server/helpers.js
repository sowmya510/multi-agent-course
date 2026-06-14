// Shared helpers: JWT signing/verification, auth middleware, and the
// experiment serializer that annotates every experiment with the current
// user's own rating and saved state plus the shared average.
const jwt = require('jsonwebtoken');
const { db } = require('./db');

// Defaults to a baked-in dev secret so the app runs with no .env.
const JWT_SECRET = process.env.JWT_SECRET || 'sprint-zero-dev-secret';

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '30d' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'unauthorized', message: 'Missing or invalid token.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'unauthorized', message: 'Missing or invalid token.' });
  }
}

function publicUser(row) {
  return { id: row.id, email: row.email, created_at: row.created_at };
}

function ratingAggregate(experimentId) {
  const agg = db
    .prepare('SELECT AVG(stars) avg, COUNT(*) cnt FROM ratings WHERE experiment_id = ?')
    .get(experimentId);
  return {
    average_rating: agg.cnt > 0 ? Math.round(agg.avg * 10) / 10 : null,
    rating_count: agg.cnt,
  };
}

// Build the contract-shaped experiment object for a given user.
// full=true adds materials + steps; savedAt (when provided) adds saved_at.
function serializeExperiment(exp, userId, { full = false, savedAt = undefined } = {}) {
  const { average_rating, rating_count } = ratingAggregate(exp.id);
  const mine = db
    .prepare('SELECT stars FROM ratings WHERE experiment_id = ? AND user_id = ?')
    .get(exp.id, userId);
  const saved = db
    .prepare('SELECT saved_at FROM saved_items WHERE experiment_id = ? AND user_id = ?')
    .get(exp.id, userId);

  const base = {
    id: exp.id,
    title: exp.title,
    summary: exp.summary,
    subject: exp.subject,
    difficulty: exp.difficulty,
    time_band: exp.time_band,
    cost_band: exp.cost_band,
    average_rating,
    rating_count,
    my_rating: mine ? mine.stars : null,
    is_saved: !!saved,
  };

  if (full) {
    base.materials = JSON.parse(exp.materials);
    base.steps = JSON.parse(exp.steps);
  }
  if (savedAt !== undefined) base.saved_at = savedAt;
  return base;
}

module.exports = { JWT_SECRET, signToken, authMiddleware, publicUser, ratingAggregate, serializeExperiment };
