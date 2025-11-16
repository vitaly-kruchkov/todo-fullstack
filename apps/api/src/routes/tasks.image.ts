import { Hono } from "hono";
import { TaskRow, Env } from "@helper/types";
import type { D1Database } from "@cloudflare/workers-types";

export const tasksImageRoutes = new Hono<{
  Bindings: Env;
  Variables: { db: D1Database };
}>();

tasksImageRoutes.post("/:id/image", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const task = await c.var.db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .bind(id)
    .first<TaskRow>();
  if (!task) return c.json({ error: "Task not found" }, 404);

  try {
    // const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });

    // const result = await openai.images.generate({
    //   model: "gpt-image-1",
    //   prompt: `Create a minimal illustrative icon for a task titled "${task.title}"`,
    //   size: "1024x1024",
    // });

    // const imageUrl = result.data?.[0]?.url ?? null;
    // if (!imageUrl)
    //   return c.json({ error: "Failed to generate image URL" }, 500);

    const random = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/seed/${id}-${random}/512/512`;

    await c.var.db
      .prepare("UPDATE tasks SET imageUrl = ?, updatedAt = ? WHERE id = ?")
      .bind(imageUrl, new Date().toISOString(), id)
      .run();

    return c.json({ imageUrl });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Image generation failed" }, 500);
  }
});
