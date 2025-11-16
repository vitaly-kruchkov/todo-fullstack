import { Hono } from "hono";
import { TaskSchema, TaskUpdateSchema, TaskRow, Env } from "@helper/types";
import type { D1Database } from "@cloudflare/workers-types";

export const tasksRoutes = new Hono<{
  Bindings: Env;
  Variables: { db: D1Database };
}>();

tasksRoutes.get("/", async (c) => {
  try {
    const res = await c.var.db.prepare("SELECT * FROM tasks").all<TaskRow>();
    return c.json(res.results);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return c.text("Internal Server Error", 500);
  }
});

tasksRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const parse = TaskSchema.safeParse(body);

  if (!parse.success) {
    return c.json({ error: parse.error.format() }, 400);
  }

  const { title, notes, priority, dueDate } = parse.data;
  const now = new Date().toISOString();

  const res = await c.var.db
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

tasksRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const task = await c.var.db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .bind(id)
    .first<TaskRow>();
  if (!task) return c.json({ error: "Task not found" }, 404);
  return c.json(task);
});

tasksRoutes.patch("/:id", async (c) => {
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

  await c.var.db
    .prepare(`UPDATE tasks SET ${setClause}, updatedAt = ? WHERE id = ?`)
    .bind(...values)
    .run();

  const updatedTask = await c.var.db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .bind(id)
    .first<TaskRow>();
  return c.json(updatedTask);
});

tasksRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await c.var.db.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});
