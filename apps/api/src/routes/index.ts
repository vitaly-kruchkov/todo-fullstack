import { Hono } from "hono";
import { Env } from "@helper/types";
import type { D1Database } from "@cloudflare/workers-types";
import { tasksRoutes } from "./tasks";
import { tasksEnhanceRoutes } from "./tasks.enhance";
import { tasksImageRoutes } from "./tasks.image";

export const tasksRouter = new Hono<{
  Bindings: Env;
  Variables: { db: D1Database };
}>();

tasksRouter.route("/", tasksRoutes);
tasksRouter.route("/", tasksEnhanceRoutes);
tasksRouter.route("/", tasksImageRoutes);
