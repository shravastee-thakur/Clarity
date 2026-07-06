import { env } from "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { sanitizeMiddleware } from "./middlewares/sanitize.js";

import userRoutes from "./routes/userRoutes.js";

import workspaceRoutes from "./routes/workspaceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import inviteRoutes from "./routes/inviteRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(sanitizeMiddleware);

// Routes

app.use("/api/v1/users", userRoutes);
// http://localhost:8080/api/v1/users/

app.use("/api/v1/", inviteRoutes);
// http://localhost:8080/api/v1/workspaces/:workspaceId/invites

app.use("/api/v1/workspaces", workspaceRoutes);
// http://localhost:8080/api/v1/workspaces/

app.use("/api/v1/", projectRoutes);
// http://localhost:8080/api/v1/workspaces/:workspaceId/projects

app.use("/api/v1/", taskRoutes);
// http://localhost:8080/api/v1/workspaces/:workspaceId/tasks

app.use(errorHandler);
export default app;
