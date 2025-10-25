import mongoose, { Document } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: string;
  videoData: any; // Aquí guardamos toda la info del video
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
    videoData: {
      type: Object,
      required: true, // Ahora siempre debe venir con la info del video
    },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
