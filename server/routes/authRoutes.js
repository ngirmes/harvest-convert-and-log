import express from "express";
const routerAuth = express.Router();

import { register, login, getMe } from "../controllers/authControllers.js";
import hashPass from "../middleware/hashPass.js";
import checkUserExists from "../middleware/checkUserExists.js";
import validate from "../validation/validate.js";
import { authSchema } from "../validation/authSchemas.js";
import authenticateToken from "../middleware/authenticateToken.js";

routerAuth.post("/login", validate(authSchema), login);
routerAuth.post(
  "/register",
  validate(authSchema),
  checkUserExists,
  hashPass,
  register,
);
routerAuth.get("/me", authenticateToken, getMe);

export default routerAuth;
