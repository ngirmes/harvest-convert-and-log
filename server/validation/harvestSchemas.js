import { z } from "zod";

export const harvestSchema = z.object({
  harvest_token: z.string().min(1, "Harvest token is required"),
  harvest_ID: z.string().min(1, "Harvest ID is required"),
});
