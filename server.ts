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
app.use(cors({
  origin: ["https://movu-theta.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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
