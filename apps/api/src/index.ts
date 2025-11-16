import { Hono, type Context } from "hono";
import { Env } from "@helper/types";
import { cors } from "hono/cors";
import type { D1Database } from "@cloudflare/workers-types";
import { tasksRouter } from "./routes";

const app = new Hono<{ Bindings: Env; Variables: { db: D1Database } }>();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

const createFactory = () => ({
  createMiddleware: (
    handler: (
      c: Context<{ Bindings: Env; Variables: { db: D1Database } }>,
      next: () => Promise<void>
    ) => Promise<void>
  ) => {
    return handler;
  },
});

const factory = createFactory();

const middleware = factory.createMiddleware(async (c, next) => {
  c.set("db", c.env.DB);
  await next();
});

app.use("*", middleware);

app.get("/", (c) => c.text("API is running"));

app.route("/api/tasks", tasksRouter);

export default app;
