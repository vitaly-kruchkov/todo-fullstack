import React, { useState } from "react";
import { useTaskStore } from "../store";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const addTask = useTaskStore((s) => s.addTask);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addTask({ title });
    setTitle("");
  };

  return (
    <form onSubmit={submit} className="mb-4 flex flex-col sm:flex-row gap-2">
      <label htmlFor="new-task" className="sr-only">
        New Task
      </label>
      <input
        id="new-task"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
        className="flex-1 border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 rounded"
        tabIndex={0}>
        Add
      </button>
    </form>
  );
}
