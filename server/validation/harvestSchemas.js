import { z } from "zod";

export const harvestSchema = z.object({
  harvest_token: z.string().min(1, "Harvest token is required"),
  harvest_id: z.string().min(1, "Harvest ID is required"),
  harvest_email: z.email().min(1, "Harvest email is required"),
});
