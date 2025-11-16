import { Hono } from "hono";
import OpenAI from "openai";
import { TaskRow, Env } from "@helper/types";
import type { D1Database } from "@cloudflare/workers-types";

export const tasksEnhanceRoutes = new Hono<{
  Bindings: Env;
  Variables: { db: D1Database };
}>();

tasksEnhanceRoutes.post("/:id/enhance", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const task = await c.var.db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .bind(id)
    .first<TaskRow>();

  if (!task) return c.json({ error: "Task not found" }, 404);

  try {
    const allTasksResult = await c.var.db
      .prepare("SELECT title, notes FROM tasks WHERE id != ?")
      .bind(id)
      .all<TaskRow>();
    const allTasks = allTasksResult.results;

    const isDuplicate = allTasks.some(
      (t) => t.title === task.title && t.notes === task.notes
    );

    if (isDuplicate) {
      return c.json({ error: "Duplicate task detected" }, 409);
    }

    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    const prompt = `
System: You are an assistant helping users elaborate tasks into actionable checklists.
User: Title: "${task.title}"
Notes: "${task.notes ?? ""}"
Please return JSON with the following keys:
- summary (string)
- steps (array of strings)
- risks (array of strings)
- estimateHours (number)
- tags (array of strings)
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let responseText = completion.choices[0].message?.content ?? "";

    const cleanedText = responseText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    let enhancedData: {
      summary?: string;
      steps?: string[];
      risks?: string[];
      estimateHours?: number;
      tags?: string[];
    } = {};

    try {
      enhancedData = JSON.parse(cleanedText);
    } catch (err) {
      console.warn("Failed to parse AI response, using raw text");
      enhancedData.summary = cleanedText;
    }

    await c.var.db
      .prepare(
        "UPDATE tasks SET enhancedDescription = ?, updatedAt = ? WHERE id = ?"
      )
      .bind(JSON.stringify(enhancedData), new Date().toISOString(), id)
      .run();

    return c.json(enhancedData);
  } catch (err: unknown) {
    console.error("OpenAI enhance error:", err);
    return c.json({ error: "OpenAI quota exceeded, try later" }, 429);
  }
});
