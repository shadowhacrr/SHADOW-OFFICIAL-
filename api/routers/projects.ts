import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { readJson, writeJson } from "../data/storage";

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  link: z.string(),
  category: z.string(),
  createdAt: z.string(),
});

export const projectsRouter = createRouter({
  list: publicQuery.query(() => {
    return readJson("projects.json", []);
  }),

  add: publicQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        image: z.string(),
        link: z.string(),
        category: z.string().default("General"),
      })
    )
    .mutation(({ input }) => {
      const projects = readJson<z.infer<typeof ProjectSchema>[]>("projects.json", []);
      const newProject = {
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date().toISOString(),
      };
      projects.push(newProject);
      writeJson("projects.json", projects);
      return newProject;
    }),

  delete: publicQuery
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const projects = readJson<z.infer<typeof ProjectSchema>[]>("projects.json", []);
      const filtered = projects.filter((p) => p.id !== input.id);
      writeJson("projects.json", filtered);
      return { success: true };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        link: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const projects = readJson<z.infer<typeof ProjectSchema>[]>("projects.json", []);
      const idx = projects.findIndex((p) => p.id === input.id);
      if (idx === -1) throw new Error("Project not found");
      projects[idx] = { ...projects[idx], ...input };
      writeJson("projects.json", projects);
      return projects[idx];
    }),
});
