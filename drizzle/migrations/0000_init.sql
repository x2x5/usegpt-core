CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  prompt_content TEXT NOT NULL,
  keywords TEXT,
  category_id INTEGER,
  author_name TEXT DEFAULT 'Anonymous',
  author_avatar TEXT,
  suitable_models TEXT,
  usage_instructions TEXT,
  example_input TEXT,
  example_output TEXT,
  variables TEXT,
  like_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'approved',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
