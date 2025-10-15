import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * User interface for MongoDB using Mongoose.
 *
 * Represents a system user with personal information,
 * authentication data, and automatic timestamps.
 */
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User schema definition
 */
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true, min: 13 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

/**
 * User model
 */
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
