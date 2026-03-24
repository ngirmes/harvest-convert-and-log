import express from "express";
const routerAPI = express.Router();

import validate from "../validation/validate.js";

import {
  harvestCredentials,
  postProject,
  getProjects,
  patchTasks,
  embed,
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
routerAPI.get("/projects", getProjects);
routerAPI.patch("/projects/:id", patchTasks);
routerAPI.post("/embed", embed);
// routerAPI.get("/harvest-me", authenticateToken, harvestMe);
export default routerAPI;
