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
    const mongoUri: string = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
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
