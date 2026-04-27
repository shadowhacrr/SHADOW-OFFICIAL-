import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { readJson, writeJson } from "../data/storage";

export const adminRouter = createRouter({
  login: publicQuery
    .input(z.object({ password: z.string() }))
    .mutation(({ input }) => {
      const admin = readJson("admin.json", { password: "admin123", theme: 0 });
      if (admin.password === input.password) {
        return { success: true, token: btoa(input.password) };
      }
      return { success: false, error: "Invalid password" };
    }),

  verify: publicQuery
    .input(z.object({ token: z.string() }))
    .query(({ input }) => {
      const admin = readJson("admin.json", { password: "admin123", theme: 0 });
      try {
        const decoded = atob(input.token);
        return { valid: decoded === admin.password };
      } catch {
        return { valid: false };
      }
    }),

  changePassword: publicQuery
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(4),
      })
    )
    .mutation(({ input }) => {
      const admin = readJson("admin.json", { password: "admin123", theme: 0 });
      if (admin.password !== input.currentPassword) {
        return { success: false, error: "Current password is incorrect" };
      }
      admin.password = input.newPassword;
      writeJson("admin.json", admin);
      return { success: true, token: btoa(input.newPassword) };
    }),

  getTheme: publicQuery.query(() => {
    const admin = readJson("admin.json", { password: "admin123", theme: 0 });
    return admin.theme;
  }),
});
