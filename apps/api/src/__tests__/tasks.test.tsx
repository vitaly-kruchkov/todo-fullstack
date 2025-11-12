import { describe, it, expect } from "vitest";
import app from "../index"; // твой Hono app
import type { TaskRow } from "@helper/types";

describe("Tasks API", () => {
  it("GET /api/tasks should return an array", async () => {
    const response = await app.fetch(
      new Request("http://localhost:8787/api/tasks")
    );
    expect(response.status).toBe(200);

    const tasks: TaskRow[] = await response.json();
    expect(Array.isArray(tasks)).toBe(true);
  });

  it("POST /api/tasks should create a new task", async () => {
    const newTask = {
      title: "Test Task",
      notes: "Test notes",
      priority: 2,
      dueDate: new Date().toISOString(),
    };

    const response = await app.fetch(
      new Request("http://localhost:8787/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
    );

    expect(response.status).toBe(200);

    const createdTask: TaskRow = await response.json();
    expect(createdTask).toHaveProperty("id");
    expect(createdTask.title).toBe(newTask.title);
    expect(createdTask.notes).toBe(newTask.notes);
  });
});
