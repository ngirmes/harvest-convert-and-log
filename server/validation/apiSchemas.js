import { z } from "zod";

export const harvestCredentialsSchema = z.object({
  harvest_token: z.string().min(1, "Harvest token is required"),
  harvest_ID: z.string().min(1, "Harvest ID is required"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

export const tasksSchema = z.object({
  tasks: z
    .array(
      z.object({
        name: z.string().min(1, "Task name is required"),
      }),
    )
    .min(1, "At least one task is required"),
  projectId: z.number().int().positive("Project ID must be a positive integer"),
});
