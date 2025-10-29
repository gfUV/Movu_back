import mongoose, { Document } from "mongoose";

/**
 * @interface IComment
 * @description Represents a user comment on a video.
 */
export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @constant commentSchema
 * @description Defines the structure of the Comment collection in MongoDB.
 */
const commentSchema = new mongoose.Schema<IComment>(
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
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/**
 * @model Comment
 * @description Mongoose model for video comments.
 */
export const Comment = mongoose.model<IComment>("Comment", commentSchema);
