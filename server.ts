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

// Configure CORS: support multiple allowed origins via FRONTEND_URL (comma-separated)
// and always allow localhost during development so you can run the frontend locally.
const rawFrontend = process.env.FRONTEND_URL || '';
const allowedOrigins = rawFrontend
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  // allow common local dev origins (Vite at 5173 and 3000)
  allowedOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000');
}

// default to the Vercel frontend if nothing provided
if (allowedOrigins.length === 0) {
  allowedOrigins.push('https://movu-teal.vercel.app');
}

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
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
