import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { readJson, writeJson } from "../data/storage";

const SettingsSchema = z.object({
  theme: z.number().default(0),
  title: z.string().default("Web Developer Portfolio"),
  subtitle: z.string().default("Full Stack Developer"),
  description: z.string().default("I create stunning web experiences."),
  name: z.string().default("Your Name"),
  email: z.string().default("your@email.com"),
  phone: z.string().default(""),
  location: z.string().default(""),
  social: z.object({
    github: z.string().default(""),
    linkedin: z.string().default(""),
    twitter: z.string().default(""),
    instagram: z.string().default(""),
  }).default({}),
  skills: z.array(z.string()).default([]),
});

export const settingsRouter = createRouter({
  get: publicQuery.query(() => {
    return readJson("settings.json", {
      theme: 0,
      title: "Web Developer Portfolio",
      subtitle: "Full Stack Developer",
      description: "I create stunning web experiences.",
      name: "Your Name",
      email: "your@email.com",
      phone: "",
      location: "",
      social: { github: "", linkedin: "", twitter: "", instagram: "" },
      skills: [],
    });
  }),

  update: publicQuery
    .input(SettingsSchema.partial())
    .mutation(({ input }) => {
      const current = readJson<z.infer<typeof SettingsSchema>>("settings.json", {} as any);
      const updated = { ...current, ...input };
      writeJson("settings.json", updated);
      return updated;
    }),

  updateTheme: publicQuery
    .input(z.object({ theme: z.number() }))
    .mutation(({ input }) => {
      const current = readJson<z.infer<typeof SettingsSchema>>("settings.json", {} as any);
      current.theme = input.theme;
      writeJson("settings.json", current);
      // Also update admin theme
      const admin = readJson("admin.json", { password: "admin123", theme: 0 });
      admin.theme = input.theme;
      writeJson("admin.json", admin);
      return current;
    }),
});
