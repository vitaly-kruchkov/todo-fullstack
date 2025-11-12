import { useEffect } from "react";
import { useTaskStore } from "./store";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const { fetchAll } = useTaskStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">📝 To-Do App with AI</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default App;
