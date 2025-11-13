# Todo fullstack

A full-stack To-Do application with AI-enhanced task descriptions. Users can create tasks, and an LLM generates structured guidance including summary, steps, risks, estimated hours, and suggested tags. Built with React, Cloudflare Workers, and D1 (SQLite).

---

## ⚙️ Local Development

### 1. Clone the repository

Prerequisites
• Node.js >= 20
• pnpm / npm / yarn
• Cloudflare account + Workers environment
• OpenAI API key

```bash
git clone https://github.com/vitaly-kruchkov/todo-fullstack.git
cd todo-fullstack
```

### 2. Install dependencies

```bash
npm install
```

Create a .env file or create .dev.vars file in infra page for cloudfire's variables

```bash
OPENAI_API_KEY=your_openai_key
```

Run D1 migrations:

```bash
pnpm db:migrate:local
```

or

```bash
pnpm db:migrate:remote
```

```
• FE runs on http://localhost:5173
• API runs on http://localhost:8787
```

### 3. Testing

```bash
pnpm test
```

### 4. Deployment

```bash
pnpm dev
```

### 5. Assumptions & Notes

```
• Anonymous session; no full auth.
• enhancedDescription is always stored as JSON string; frontend parses it.
• LLM image generation is optional; currently uses placeholder images.
• Rate-limiting and error handling for LLM calls included.

```

### 6. API endpoints

```
Method               Endpoint                   Description
POST            /api/tasks                  Create a new task
GET             /api/tasks                  List tasks with optional filters: ?status=&priority=&q=
GET             /api/tasks/:id              Fetch single task
PATCH           /api/tasks/:id              Update task partially
DELETE          /api/tasks/:id              Delete task
POST            /api/tasks/:id/enhance      Call LLM to generate/refresh enhancedDescription

```

### 7. Architecture Overview

```
monorepo-root/
├── apps/
│   ├── web/                # React (Vite) frontend
│   └── api/                # Cloudflare Worker (Hono) backend
├── packages/
│   ├── types/              # Shared TypeScript types & Zod schemas
│   └── utils/              # Shared helpers (API client, fetch wrapper)
├── infra/
│   ├── wrangler.toml       # Cloudflare config
│   ├── migrations/         # D1 SQL migrations
└── package.json            # Monorepo workspace setup

```

### 8. Data flow

```
User (React UI)
   ↓
Frontend API client (fetch)
   ↓
Cloudflare Worker (Hono API)
   ↓
D1 Database (SQLite on Cloudflare)
   ↓
OpenAI (enhancement call)
   ↓
Enhanced JSON description saved back to DB
```

### 9. Tech Choices & Tradeoffs

```

Area                       Choice                                    Reasoning
Frontend            React + Vite + Tailwind              Fast DX, simple to host on Cloudflare Pages.
Backend             Cloudflare Workers + Hono            Lightweight, TypeScript-native, fast cold starts.
Database            Cloudflare D1 (SQLite)               Native to Cloudflare, no external setup, but limited concurrency.
LLM                 OpenAI GPT-4o-mini                   Free-tier capable, fast completions, good JSON fidelity.
State Management    Zustand                              Minimal and predictable state for tasks and filters.
Validation          Zod                                  Shared schema validation between FE and BE.
Monorepo            pnpm workspaces                      Simplifies shared code and deployment scripts.
Tests               Vitest (FE) + Hono test runner (BE)  Lightweight, easy CI integration.

```

### 10. Data Model

```
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  notes TEXT,
  enhancedDescription TEXT,
  status TEXT CHECK(status IN ('open','done')) DEFAULT 'open',
  priority INTEGER,
  dueDate DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### 11.
