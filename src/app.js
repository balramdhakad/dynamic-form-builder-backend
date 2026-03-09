import express from "express";
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { addCorrelationId } from "./middlewares/correlationMiddleware.js";
import { globalRateLimiter } from "./middlewares/rateLimit.js";
import cors from "cors";
import { pool } from "./db/connection.js";

const app = express();


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addCorrelationId)

app.get("/health", async (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date(),
    services: {},
  };

  try {
    await pool.query("SELECT 1");
    health.services.postgres = "connected";
  } catch (err) {
    health.status = "FAIL";
    health.services.postgres = "disconnected";
  }

  res.status(200).json(health);
});

app.use(globalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(errorHandler)
export default app;
