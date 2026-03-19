import { z } from "zod";

export const authSchema = z.object({
  email: z.union([z.literal("dev"), z.email().min(1, "Email is required")]),
  password: z.string().min(1, "Password is required"),
});
