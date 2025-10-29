import mongoose, { Document } from "mongoose";

/**
 * Interface representing a user rating for a specific video.
 */
export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: string;
  rating: number; // Between 1 and 5
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for video ratings.
 */
const ratingSchema = new mongoose.Schema<IRating>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

export const Rating = mongoose.model<IRating>("Rating", ratingSchema);
