import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./api/routes/routes";
import { connectDB } from "./api/config/dataBase";

dotenv.config();

const app: Application = express();

/**
 * Middleware Configuration
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS: allow the frontend URL set in FRONTEND_URL (useful for Vercel)
const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? undefined : '*');
if (frontendUrl) {
  app.use(cors({ origin: frontendUrl }));
} else {
  // If FRONTEND_URL is not set in production, fall back to a restrictive default
  app.use(cors({ origin: ['https://movu-teal.vercel.app'] }));
}

/**
 * Main API Routes
 */
app.use("/api/v1", routes);

/**
 * Database Connection
 */
connectDB();

/**
 * Health Check Endpoint
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

/**
 * Start the Server
 */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
