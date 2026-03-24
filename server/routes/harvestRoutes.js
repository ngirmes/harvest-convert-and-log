import express from "express";
const routerHarvest = express.Router();

import validate from "../validation/validate.js";
import encryptHarvestCredentials from "../middleware/encryptHarvestCredentials.js";
import authenticateToken from "../middleware/authenticateToken.js";

import { postHarvestCredentials } from "../controllers/harvestControllers.js";

import { harvestSchema } from "../validation/harvestSchemas.js";

routerHarvest.post(
  "/",
  authenticateToken,
  validate(harvestSchema),
  encryptHarvestCredentials,
  postHarvestCredentials,
);

export default routerHarvest;
