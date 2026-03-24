import express from "express";
const routerHarvest = express.Router();

import validate from "../validation/validate.js";
import encryptHarvestCredentials from "../middleware/encryptHarvestCredentials.js";
import decryptHarvestCredentials from "../middleware/decryptHarvestCredentials.js";

import {
  postHarvestCredentials,
  getData,
} from "../controllers/harvestControllers.js";

import { harvestSchema } from "../validation/harvestSchemas.js";

routerHarvest.post(
  "/",
  validate(harvestSchema),
  encryptHarvestCredentials,
  postHarvestCredentials,
);

routerHarvest.get("/", decryptHarvestCredentials, getData);

export default routerHarvest;
