import express from "express";
const routerAPI = express.Router();

import authenticateToken from "../middleware/authenticateToken.js";
import hashHarvestCredentials from "../middleware/hashHarvestCredentials.js";
import { harvestCredentials } from "../controllers/apiControllers.js";
import validate from "../validation/validate.js";
import { harvestCredentialsSchema } from "../validation/apiSchemas.js";

routerAPI.post(
  "/harvest-credentials",
  authenticateToken,
  validate(harvestCredentialsSchema),
  hashHarvestCredentials,
  harvestCredentials,
);

// routerAPI.get("/harvest-me", authenticateToken, harvestMe);
export default routerAPI;
