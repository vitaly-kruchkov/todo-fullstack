import { useState } from "react";
import { useTaskStore } from "../store";
import type { PriorityFilter, Task, TaskRow } from "@helpers/types";

export default function TaskList() {
  const {
    tasks,
    deleteTask,
    enhanceTask,
    updateTask,
    searchText,
    statusFilter,
    priorityFilter,
    setSearchText,
    setStatusFilter,
    setPriorityFilter,
  } = useTaskStore();

  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Partial<Task>>({});

  const startEdit = (task: Task) => {
    setEditTaskId(task.id);
    setEditFields({
      title: task.title,
      notes: task.notes,
      priority: task.priority,
      dueDate: task.dueDate,
      enhancedDescription: task.enhancedDescription,
    });
  };

  const saveEdit = async () => {
    if (editTaskId !== null) {
      await updateTask(editTaskId, editFields);
      setEditTaskId(null);
      setEditFields({});
    }
  };

  const toggleStatus = (id: number, status: "open" | "done") => {
    updateTask(id, { status: status === "open" ? "done" : "open" });
  };

  const filteredTasks = tasks
    .filter((t) => !statusFilter || t.status === statusFilter)
    .filter((t) => !priorityFilter || t.priority === priorityFilter)
    .filter((t) =>
      t.title?.toLowerCase().includes(searchText.toLowerCase() ?? "")
    );

  const priorityBadge = (priority?: number) => {
    if (!priority) return null;
    const config = [
      { value: 1, label: "High", bg: "bg-red-100", text: "text-red-800" },
      {
        value: 2,
        label: "Medium",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
      },
      { value: 3, label: "Low", bg: "bg-green-100", text: "text-green-800" },
    ].find((p) => p.value === priority);

    if (!config) return null;

    return (
      <span
        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Фильтры и поиск */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search by title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskRow["status"])}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="done">Done</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(
              (e.target.value ? Number(e.target.value) : "") as PriorityFilter
            )
          }
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">All Priority</option>
          <option value="1">High</option>
          <option value="2">Medium</option>
          <option value="3">Low</option>
        </select>
      </div>

      {/* Список задач */}
      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded-lg flex justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow duration-150">
            <div className="flex flex-col gap-2 w-full">
              {editTaskId === task.id ? (
                <>
                  <input
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editFields.title ?? ""}
                    onChange={(e) =>
                      setEditFields({ ...editFields, title: e.target.value })
                    }
                  />
                  <textarea
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editFields.enhancedDescription ?? ""}
                    onChange={(e) =>
                      setEditFields({
                        ...editFields,
                        enhancedDescription: e.target.value,
                      })
                    }
                  />
                  <select
                    value={editFields.priority ?? ""}
                    onChange={(e) =>
                      setEditFields({
                        ...editFields,
                        priority: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Select priority</option>
                    <option value="1">High</option>
                    <option value="2">Medium</option>
                    <option value="3">Low</option>
                  </select>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={saveEdit}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors">
                      Save
                    </button>
                    <button
                      onClick={() => setEditTaskId(null)}
                      className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 transition-colors">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="checkbox"
                      checked={task.status === "done"}
                      onChange={() => toggleStatus(task.id, task.status)}
                      className="h-5 w-5 accent-blue-500"
                    />
                    <span
                      className={`font-medium ${
                        task.status === "done"
                          ? "line-through text-gray-400"
                          : ""
                      }`}>
                      {task.title}
                    </span>
                    {priorityBadge(task.priority)}
                  </div>
                  {task.enhancedDescription && (
                    <pre className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                      {task.enhancedDescription}
                    </pre>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      onClick={() => startEdit(task)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors">
                      Edit
                    </button>
                    <button
                      onClick={() => enhanceTask(task.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">
                      Enhance AI
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
