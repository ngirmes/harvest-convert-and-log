import { z } from "zod";

export const harvestTokenSchema = z.object({
  harvest_token: z.string().min(1, "Harvest token is required"),
});
