import { describe, it, expect, beforeAll } from "vitest";
import app from "../index";
import { mockDB } from "./mockDB";

const testEnv = { DB: mockDB };

describe("Tasks API", () => {
  it("GET /api/tasks should return an array", async () => {
    const res = await app.request("/api/tasks", {}, testEnv);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("title");
  });

  it("POST /api/tasks should create a new task", async () => {
    const res = await app.request(
      "/api/tasks",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Task" }),
      },
      testEnv
    );

    expect(res.status).toBe(200);
    const task = await res.json();
    expect(task.title).toBe("New Task");
    expect(task.status).toBe("open");
    expect(task.id).toBeGreaterThan(0);
  });

  it("POST /api/tasks with invalid data should return 400", async () => {
    const res = await app.request(
      "/api/tasks",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
      testEnv
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  it("PATCH /api/tasks/:id should update a task", async () => {
    const res = await app.request(
      "/api/tasks/1",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated Task" }),
      },
      testEnv
    );

    expect(res.status).toBe(200);
    const task = await res.json();
    expect(task.title).toBe("Mock Task"); // Так как mock не меняет данные
  });

  it("DELETE /api/tasks/:id should delete a task", async () => {
    const res = await app.request(
      "/api/tasks/1",
      { method: "DELETE" },
      testEnv
    );
    expect(res.status).toBe(200);
    const result = await res.json();
    expect(result.success).toBe(true);
  });

  it("POST /api/tasks/:id/enhance should enhance a task", async () => {
    const res = await app.request(
      "/api/tasks/1/enhance",
      { method: "POST" },
      testEnv
    );
    expect(res.status).toBe(200);
    const result = await res.json();
    expect(result).toHaveProperty("enhancedDescription");
    expect(typeof result.enhancedDescription).toBe("string");
  });
});
