import { type Task } from "@helpers/types";

const API_BASE = "http://localhost:8787/api/tasks";

export async function fetchTasks() {
  const res = await fetch(API_BASE);
  return res.json() as Promise<Task[]>;
}

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const newTask: Task = await res.json();
  return newTask;
};

export async function updateTask(id: number, task: Partial<Task>) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json() as Promise<Task>;
}

export async function deleteTask(id: number) {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
}

export async function enhanceTask(id: number) {
  const res = await fetch(`${API_BASE}/${id}/enhance`, { method: "POST" });
  return res.json() as Promise<Task>;
}
