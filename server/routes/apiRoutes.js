import express from "express";
const routerAPI = express.Router();

import validate from "../validation/validate.js";

import {
  postProject,
  getProjects,
  patchTasks,
  embed,
} from "../controllers/apiControllers.js";

import { projectSchema, tasksSchema } from "../validation/apiSchemas.js";

routerAPI.post("/project", validate(projectSchema), postProject);
routerAPI.get("/projects", getProjects);
routerAPI.patch("/projects/:id", patchTasks);
routerAPI.post("/embed", embed);
// routerAPI.get("/harvest-me", authenticateToken, harvestMe);
export default routerAPI;
