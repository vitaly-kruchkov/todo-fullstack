import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "../components/TaskForm";
import { expect, test, vi, beforeEach } from "vitest";

vi.mock("../../store", () => ({
  useTaskStore: vi.fn(() => ({
    addTask: vi.fn(async () => {}),
  })),
}));

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      ok: true,
    } as Response)
  );
});

test("renders TaskForm and submits task", async () => {
  render(<TaskForm />);
  const input = screen.getByPlaceholderText("New task");
  const button = screen.getByRole("button", { name: /add/i });

  await userEvent.type(input, "Test Task");
  await userEvent.click(button);

  expect((input as HTMLInputElement).value).toBe("");
});
