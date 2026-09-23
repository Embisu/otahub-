PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS news_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  site_url TEXT,
  category TEXT NOT NULL DEFAULT 'news',
  language TEXT NOT NULL DEFAULT 'vi',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  fetch_interval_minutes INTEGER NOT NULL DEFAULT 120 CHECK (fetch_interval_minutes >= 15),
  last_fetched_at TEXT,
  last_success_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collected_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL REFERENCES news_sources(id) ON DELETE CASCADE,
  external_id TEXT,
  canonical_url TEXT NOT NULL,
  url_hash TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  content_text TEXT,
  author TEXT,
  image_url TEXT,
  published_at TEXT,
  collected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'shortlisted', 'drafted', 'ignored', 'published', 'failed')),
  fingerprint TEXT,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_collected_status_date
  ON collected_articles(status, published_at DESC, collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_collected_source
  ON collected_articles(source_id, collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_collected_fingerprint
  ON collected_articles(fingerprint);

CREATE TABLE IF NOT EXISTS generation_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER NOT NULL REFERENCES collected_articles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  model TEXT,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS generated_drafts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER NOT NULL REFERENCES collected_articles(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES generation_jobs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  body_html TEXT NOT NULL,
  source_notes TEXT,
  status TEXT NOT NULL DEFAULT 'review' CHECK (status IN ('review', 'approved', 'rejected', 'published')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_drafts_status_date
  ON generated_drafts(status, created_at DESC);

CREATE TABLE IF NOT EXISTS source_fetch_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER REFERENCES news_sources(id) ON DELETE SET NULL,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TEXT,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed')),
  fetched_count INTEGER NOT NULL DEFAULT 0,
  inserted_count INTEGER NOT NULL DEFAULT 0,
  error TEXT
);
