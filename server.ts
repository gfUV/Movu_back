import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./api/routes/routes";
import { connectDB } from "./api/config/dataBase";

dotenv.config();

const app: Application = express();

/**
 * Database Connection
 */
connectDB();

/**
 * Middleware Configuration
 */

// 🔹 CORS primero
app.use(
  cors({
    origin: [
      "https://movu-theta.vercel.app", // Frontend en producción (Vercel)
      "http://localhost:5173"          // Frontend local
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🔹 Luego parseadores de body (JSON y formularios)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Middleware de diagnóstico (opcional, ayuda a depurar Render)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") {
    console.log("📩 Request Body:", req.body);
  }
  next();
});

/**
 * Main API Routes
 */
app.use("/api/v1", routes);

/**
 * Health Check Endpoint
 */
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Server is running correctly");
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
