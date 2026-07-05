import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  authProvider: "local" | "magic" | "google"; // Tracks how they log in
  refreshToken: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(plainPassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "magic", "google"],
      default: "local",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (plainPassword: string) {
  if (!this.password) return false; // Prevent errors if password is null
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
