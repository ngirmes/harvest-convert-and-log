import express from "express";
const routerAPI = express.Router();

import encryptHarvestCredentials from "../middleware/encryptHarvestCredentials.js";
import decryptHarvestCredentials from "../middleware/decryptHarvestCredentials.js";
import checkIdempotency from "../middleware/checkIdempoteny.js";

import {
  postHarvestCredentials,
  getHarvestProjects,
  getEmbeddings,
  postTimeEntries,
} from "../controllers/apiControllers.js";

import validate from "../validation/validate.js";
import { harvestSchema } from "../validation/apiSchemas.js";

routerAPI.post(
  "/credentials",
  validate(harvestSchema),
  encryptHarvestCredentials,
  postHarvestCredentials,
);
routerAPI.get("/projects", decryptHarvestCredentials, getHarvestProjects);
routerAPI.post("/embed", getEmbeddings);
routerAPI.post(
  "/time-entries",
  checkIdempotency,
  decryptHarvestCredentials,
  postTimeEntries,
);
// routerAPI.get("/harvest-me", authenticateToken, harvestMe);

export default routerAPI;
