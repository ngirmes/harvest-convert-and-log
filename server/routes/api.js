import express from "express";
const routerAPI = express.Router();

import authenticateToken from "../middleware/authenticateToken.js";
import hashHarvestToken from "../middleware/hashHarvestToken";
import { harvestToken } from "../controllers/apiControllers.js";
import validate from "../validation/validate.js";
import { harvestTokenSchema } from "../validation/apiSchemas.js";

routerAPI.post(
  "/harvest-token",
  authenticateToken,
  validate(harvestTokenSchema),
  hashHarvestToken,
  harvestToken,
);

export default routerAPI;
