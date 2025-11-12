CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  notes TEXT,
  priority INTEGER,
  dueDate TEXT,
  status TEXT DEFAULT 'open',
  createdAt TEXT,
  updatedAt TEXT,
  enhancedDescription TEXT
);