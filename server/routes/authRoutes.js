import express from "express";
const routerAuth = express.Router();

import { register, login } from "../controllers/authControllers.js";
import hashPass from "../middleware/hashPass.js";

routerAuth.post("/login", login);
routerAuth.post("/register", hashPass, register);

export default routerAuth;
