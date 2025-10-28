import { Document, Schema, model } from "mongoose";

/**
 * Interface representing a Video document in MongoDB.
 */
export interface IVideo extends Document {
  pexelsId: string;
  title?: string;
  videoUrl: string;
  subtitles?: {
    en?: string;
    es?: string;
  };
}

/**
 * Mongoose schema for videos.
 */
const VideoSchema = new Schema<IVideo>(
  {
    pexelsId: { type: String, required: true, unique: true },
    title: { type: String },
    videoUrl: { type: String, required: true },
    subtitles: {
      en: { type: String },
      es: { type: String },
    },
  },
  { timestamps: true }
);

const VideoModel = model<IVideo>("Video", VideoSchema);

export default VideoModel;
