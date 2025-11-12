import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask, enhanceTask, type Task } from "../utils/api";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";

export const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleEnhance = async (id: number) => {
    await enhanceTask(id);
    loadTasks();
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">To-Do LLM App</h1>
      <TaskForm onCreated={loadTasks} />
      <div>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEnhance={() => handleEnhance(task.id)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
};
