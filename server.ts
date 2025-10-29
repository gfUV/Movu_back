import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./api/routes/routes";
import { connectDB } from "./api/config/dataBase";
import path from "path";

dotenv.config();

/**
 * @file server.ts
 * @description Main entry point of the Movu backend application.
 * Initializes the Express server, configures middleware, connects to the database,
 * and mounts all API routes including Pexels integration.
 */

const app: Application = express();

/**
 * @section Database Connection
 * Establishes the connection to MongoDB using the custom connection utility.
 */
connectDB();

/**
 * @section CORS Configuration
 * Configures CORS to allow requests from trusted origins.
 * The allowed origins are defined in the ORIGIN environment variable (comma-separated).
 */
const allowedOrigins = process.env.ORIGIN
  ? process.env.ORIGIN.split(",").map((o) => o.trim())
  : ["https://movu-theta.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/**
 * @middleware CORS Header Fallback
 * Some hosting services (e.g., Render) may ignore dynamic CORS headers.
 * This ensures that valid origins are still explicitly allowed.
 */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

/**
 * @section Body Parsers
 * Enables JSON and URL-encoded body parsing for incoming requests.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @middleware Diagnostic Logger
 * Logs the request body for all non-GET requests.
 * Useful for debugging in production environments.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") {
    console.log("📩 Request Body:", req.body);
  }
  next();
});

/**
 * @section Static Subtitles Serving
 * Serves subtitle (.vtt) files stored in the /api/subtitles directory.
 * Accessible through URLs like: /subtitles/video1_es.vtt
 */
const subtitlesPath = path.resolve(process.cwd(), "api", "subtitles");
app.use("/subtitles", express.static(subtitlesPath));
console.log("🎬 Serving subtitles from:", subtitlesPath);

/**
 * @section Routes
 * Registers all main application routes under the `/api/v1` prefix.
 */
console.log("✅ Routes loaded: /api/v1");
app.use("/api/v1", routes);

/**
 * @route GET /
 * @description Health check endpoint to verify the server status.
 * @returns {string} A success message in Spanish for user feedback.
 */
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Servidor funcionando correctamente");
});

/**
 * @section Server Initialization
 * Starts the HTTP server on the specified PORT.
 * Displays a message in Spanish when the server is ready.
 */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

export default app;
