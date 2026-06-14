// SQLite connection and schema for Lab Quest (local data layer).
// Uses Node's built-in node:sqlite — no native build, no external dependency.
// The schema is created on first import and is safe to call repeatedly.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data.db');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL;');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS experiments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      subject TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      time_band TEXT NOT NULL,
      cost_band TEXT NOT NULL,
      materials TEXT NOT NULL,
      steps TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ratings (
      user_id TEXT NOT NULL,
      experiment_id TEXT NOT NULL,
      stars INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, experiment_id)
    );

    CREATE TABLE IF NOT EXISTS saved_items (
      user_id TEXT NOT NULL,
      experiment_id TEXT NOT NULL,
      saved_at TEXT NOT NULL,
      PRIMARY KEY (user_id, experiment_id)
    );
  `);
}

initSchema();

module.exports = { db, initSchema };
