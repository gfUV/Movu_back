import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./api/routes/routes";
import { connectDB } from "./api/config/dataBase";
import pexelsRoutes from "./api/routes/pexelsRoutes";

dotenv.config();

const app: Application = express();

/**
 * @file server.ts
 * @description Main entry point of the Movu backend application.
 * Initializes the Express server, configures middleware, connects to the database,
 * and mounts all API routes including Pexels integration.
 */

/**
 * @section Database Connection
 * Establishes the connection to MongoDB using the custom connection utility.
 */
connectDB();

/**
 * @section Middleware Configuration
 * Configures CORS, body parsers, and diagnostic logging for incoming requests.
 */

// 🔹 CORS primero
app.use(
  cors({
    origin: [
      "https://movu-theta.vercel.app", // Frontend en producción (Vercel)
      "http://localhost:5173",         // Frontend local
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🔹 Fijar manualmente encabezados CORS (Render a veces los ignora)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://movu-theta.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// 🔹 Luego parseadores de body (JSON y formularios)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @middleware Diagnostic Logger
 * Logs the body of all non-GET requests.
 * Useful for debugging on deployment platforms such as Render.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") {
    console.log("📩 Request Body:", req.body);
  }
  next();
});

/**
 * @section Pexels Routes
 * Registers the Pexels API endpoints under `/api/v1/pexels`.
 * Example: GET /api/v1/pexels/videos/popular
 */
app.use("/api/v1/pexels", pexelsRoutes);


/**
 * @section API Routes
 * Registers all main application routes under the `/api/v1` prefix.
 */
app.use("/api/v1", routes);


/**
 * @route GET /
 * @description Health check endpoint to verify the server status.
 * @returns {string} A success message in Spanish for user feedback.
 */
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Server is running correctly");
});

/**
 * @section Server Initialization
 * Starts the HTTP server on the specified PORT.
 * Displays a message in Spanish when the server is ready.
 */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
