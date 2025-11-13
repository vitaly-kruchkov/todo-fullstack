import type { D1Database } from "@cloudflare/workers-types";
import { z } from "zod";
export interface Env {
  DB: D1Database;
  OPENAI_API_KEY: string;
  [key: string]: unknown;
}

export type EnhancedDescription = {
  summary: string;
  steps: string[];
  risks: string[];
  estimateHours: number;
  tags?: string[];
};

export type TaskRow = {
  id: number;
  title: string;
  notes?: string;
  enhancedDescription?: EnhancedDescription;
  status: "open" | "done";
  priority?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export const TaskSchema = z.object({
  title: z.string().min(1),
  notes: z.string().optional(),
  priority: z.number().int().min(1).max(3).optional(),
  dueDate: z.string().optional(),
});

export const TaskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  notes: z.string().nullable().optional(),
  priority: z.number().int().min(1).max(3).nullable().optional(),
  dueDate: z.string().nullable().optional(),
  enhancedDescription: z.string().optional(),
  status: z.enum(["open", "done"]).optional(),
});

export type Task = z.infer<typeof TaskSchema> & {
  id: number;
  enhancedDescription?: string;
  status: "open" | "done";
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
};

export type PriorityFilter = 1 | 2 | 3 | "";
