import { createRouter, publicQuery } from "./middleware";
import { projectsRouter } from "./routers/projects";
import { settingsRouter } from "./routers/settings";
import { adminRouter } from "./routers/admin";
import { initStorage } from "./data/storage";

// Initialize JSON storage on first import
initStorage();

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  projects: projectsRouter,
  settings: settingsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
