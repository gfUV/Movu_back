import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Establishes a connection to the MongoDB database using the URI
 * stored in the environment variable `MONGO_URI`.
 *
 * @async
 * @function connectDB
 * @throws {Error} If the connection fails, logs the error and exits the process.
 * @returns {Promise<void>} Resolves when the connection is successful.
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Read MONGO_URI from environment. Use a local fallback only for
    // non-production environments. In production we fail fast to avoid
    // accidentally using a local DB.
    const envMongoUri: string | undefined = process.env.MONGO_URI;
    const nodeEnv = process.env.NODE_ENV || "development";

    let mongoUri: string;
    if (!envMongoUri) {
      if (nodeEnv === "production") {
        throw new Error("MONGO_URI must be defined in environment variables in production");
      }

      const fallback = "mongodb://127.0.0.1:27017/movu_back";
      console.warn(
        "⚠️  MONGO_URI is not defined. Using local fallback for development:",
        fallback,
      );
      console.warn("Create a .env file or set MONGO_URI to connect to a remote DB (see .env.example)");
      mongoUri = fallback;
    } else {
      mongoUri = envMongoUri;
    }

    await mongoose.connect(mongoUri, {
      // Estas opciones ya no son necesarias en Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");
  } catch (error: any) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * Disconnects from the MongoDB database.
 *
 * @async
 * @function disconnectDB
 * @throws {Error} If the disconnection fails, logs the error.
 * @returns {Promise<void>} Resolves when the disconnection is successful.
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error: any) {
    console.error("❌ Error disconnecting from MongoDB:", error.message);
  }
};
