import { Hono } from "hono";

import OpenAI from "openai";
import { TaskSchema, TaskUpdateSchema, Env, TaskRow } from "@helper/types";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.get("/", (c) => c.text("API is running"));

app.get("/api/tasks", async (c) => {
  try {
    const db = c.env.DB;
    const res = await db.prepare("SELECT * FROM tasks").all<TaskRow>();
    return c.json(res.results);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return c.text("Internal Server Error", 500);
  }
});

app.post("/api/tasks", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const parse = TaskSchema.safeParse(body);

  if (!parse.success) {
    return c.json({ error: parse.error.format() }, 400);
  }

  const { title, notes, priority, dueDate } = parse.data;
  const now = new Date().toISOString();

  const res = await db
    .prepare(
      'INSERT INTO tasks (title, notes, priority, dueDate, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, "open", ?, ?)'
    )
    .bind(title, notes ?? null, priority ?? null, dueDate ?? null, now, now)
    .run();

  const insertRes = res as {
    success: boolean;
    meta: { last_row_id: number };
  };

  const id = insertRes.meta.last_row_id;

  if (!id) {
    return c.json({ error: "Failed to create task" }, 500);
  }

  return c.json<TaskRow>({
    id,
    title,
    notes,
    priority,
    dueDate,
    status: "open",
    createdAt: now,
    updatedAt: now,
  });
});

app.get("/api/tasks/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const task = await db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .bind(id)
    .first<TaskRow>();
  if (!task) return c.json({ error: "Task not found" }, 404);
  return c.json(task);
});

app.patch("/api/tasks/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const body = await c.req.json();
  const parse = TaskUpdateSchema.safeParse(body);

  if (!parse.success) {
    return c.json({ error: parse.error.format() }, 400);
  }

  const fields = Object.keys(parse.data);
  if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);

  const setClause = fields.map((f) => `${f} = ?`).join(", ");
  const values = Object.values(parse.data);
  values.push(new Date().toISOString(), id);

  await db
    .prepare(`UPDATE tasks SET ${setClause}, updatedAt = ? WHERE id = ?`)
    .bind(...values)
    .run();

  const updatedTask = await db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .bind(id)
    .first<TaskRow>();
  return c.json(updatedTask);
});

app.delete("/api/tasks/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  await db.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

app.post("/api/tasks/:id/enhance", async (c) => {
  const db = c.env.DB;

  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const task = await db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .bind(id)
    .first<TaskRow>();

  if (!task) return c.json({ error: "Task not found" }, 404);
  try {
    // const openai = new OpenAI({
    //   apiKey: c.env.OPENAI_API_KEY,
    // });

    //     const prompt = `
    // System: You are an assistant helping users elaborate tasks into actionable checklists.
    // User: Title: "${task.title}"
    // Notes: "${task.notes ?? ""}"
    // Please return JSON with keys: summary, steps, risks, estimateHours.
    // `;

    //     const completion = await openai.chat.completions.create({
    //       model: "gpt-3.5-turbo",
    //       messages: [{ role: "user", content: prompt }],
    //     });

    // const enhancedDescription = completion.choices[0].message?.content ?? "";

    const enhancedDescription = `
Summary: Mock summary
Steps:
1. Step 1
2. Step 2
Risks: None
Estimate hours: 1
`;

    await db
      .prepare(
        "UPDATE tasks SET enhancedDescription = ?, updatedAt = ? WHERE id = ?"
      )
      .bind(enhancedDescription, new Date().toISOString(), id)
      .run();

    return c.json({ enhancedDescription });
  } catch (err: unknown) {
    console.error("OpenAI enhance error:", err);
    return c.json({ error: "OpenAI quota exceeded, try later" }, 429);
  }
});

export default app;
