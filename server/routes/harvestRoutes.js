import express from "express";
const routerHarvest = express.Router();

import validate from "../validation/validate";
import encryptHarvestCredentials from "../middleware/encryptHarvestCredentials.js";

import {} from "../controllers/harvestControllers.js";

import { harvestSchema } from "../validation/harvestSchemas.js";

routerHarvest.get("/harvest");
routerHarvest.post(
  "/harvest",
  validate(harvestSchema),
  encryptHarvestCredentials,
  postHarvestCredentials,
);

export default routerHarvest;
