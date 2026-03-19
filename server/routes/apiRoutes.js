import express from "express";
const routerAPI = express.Router();

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
  validate(harvestCredentialsSchema),
  hashHarvestCredentials,
  harvestCredentials,
);

routerAPI.post("/project", validate(projectSchema), postProject);

routerAPI.post("/tasks", validate(tasksSchema), newTasks);
routerAPI.get("/projects", getProjects);
// routerAPI.get("/harvest-me", authenticateToken, harvestMe);
export default routerAPI;
