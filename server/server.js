import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000;

import routerAuth from "./routes/authRoutes.js";
import routerApi from "./routes/apiRoutes.js";
import validate from "./validation/validate.js";
import { authSchema } from "./validation/authSchemas.js";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// add function calls for rate limiting to routes if not dev
const authLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour",
});

const apiLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth", validate(authSchema), routerAuth);
app.use("/api", routerApi);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
