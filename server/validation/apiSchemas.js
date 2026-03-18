import { z } from "zod";

export const harvestCredentialsSchema = z.object({
  harvest_token: z.string().min(1, "Harvest token is required"),
  harvest_ID: z.string().min(1, "Harvest ID is required"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});
