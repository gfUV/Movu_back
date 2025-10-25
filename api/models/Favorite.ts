import mongoose, { Document } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: string;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new mongoose.Schema<IFavorite>(
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
  },
  { timestamps: true }
);

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
