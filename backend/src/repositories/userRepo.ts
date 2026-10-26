import User, { IUser, IUserMethods } from "../models/userModel.js";
import { HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

export type CreateUserInput = Pick<IUser, "name" | "email" | "password"> &
  Partial<Pick<IUser, "authProvider" | "isVerified">>;

export const findByEmail = async (
  email: string,
): Promise<UserDocument | null> => {
  return User.findOne({ email }).select("+password").exec();
};

export const findById = async (
  userId: string,
): Promise<UserDocument | null> => {
  return User.findById(userId).exec();
};

export const createUser = async (
  userData: CreateUserInput,
): Promise<UserDocument> => {
  return User.create(userData);
};

export const updateUser = async (
  userId: string,
  userData: Partial<IUser>,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(userId, userData, { returnDocument: "after" });
};

export const updatePasswordAndInvalidateSessions = async (
  userId: string,
  newPassword: string,
) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // This sends a direct, atomic command to MongoDB, bypassing the .save() bug
  return User.updateOne(
    { _id: userId },
    {
      $set: {
        password: hashedPassword,
        refreshToken: "",
      },
    },
  );
};
