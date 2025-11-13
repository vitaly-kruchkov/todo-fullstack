import { create } from "zustand";
import * as api from "@utils/api";
import type { Task } from "@helpers/types";

type StatusFilter = "open" | "done" | "";
type PriorityFilter = 1 | 2 | 3 | "";

interface TaskState {
  tasks: Task[];
  searchText: string;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  fetchAll: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  enhanceTask: (id: number) => Promise<void>;
  setSearchText: (text: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setPriorityFilter: (priority: PriorityFilter) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  searchText: "",
  statusFilter: "",
  priorityFilter: "",
  fetchAll: async () => {
    const tasks = await api.fetchTasks();
    set({ tasks });
  },
  addTask: async (task) => {
    const newTask = await api.createTask(task);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  updateTask: async (id, task) => {
    const updated = await api.updateTask(id, task);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },
  deleteTask: async (id) => {
    await api.deleteTask(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
  enhanceTask: async (id) => {
    const res = await api.enhanceTask(id);
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, enhancedDescription: JSON.stringify(res, null, 2) }
          : t
      ),
    }));
  },
  setSearchText: (text) => set({ searchText: text }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
}));
