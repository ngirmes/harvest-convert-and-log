import express from "express";
const routerAPI = express.Router();

import authenticateToken from "../middleware/authenticateToken.js";
import hashHarvestCredentials from "../middleware/hashHarvestCredentials.js";
import validate from "../validation/validate.js";

import {
  harvestCredentials,
  postProject,
  getProjects,
  newTasks,
} from "../controllers/apiControllers.js";

import {
  harvestCredentialsSchema,
  projectSchema,
  tasksSchema,
} from "../validation/apiSchemas.js";

// routerAPI.get("/harvest-credentials", authenticateToken, getHarvestCredentials);

routerAPI.post(
  "/harvest-credentials",
  authenticateToken,
  validate(harvestCredentialsSchema),
  hashHarvestCredentials,
  harvestCredentials,
);

routerAPI.post(
  "/project",
  authenticateToken,
  validate(projectSchema),
  postProject,
);

routerAPI.post("/tasks", authenticateToken, validate(tasksSchema), newTasks);
routerAPI.get("/projects", authenticateToken, getProjects);
// routerAPI.get("/harvest-me", authenticateToken, harvestMe);
export default routerAPI;
