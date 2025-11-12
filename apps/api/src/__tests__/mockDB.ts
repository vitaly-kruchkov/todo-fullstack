import { TaskRow } from "@helper/types";

export const mockDB = {
  prepare: () => ({
    all: async () => ({
      results: [
        {
          id: 1,
          title: "Mock Task",
          status: "open",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as TaskRow,
      ],
    }),
    first: async () =>
      ({
        id: 1,
        title: "Mock Task",
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as TaskRow),
    bind: function () {
      return this;
    },
    run: async () => ({ success: true, meta: { last_row_id: 2 } }),
  }),
};
