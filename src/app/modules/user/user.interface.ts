import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
  ADMIN = "ADMIN",
  GUIDE = "GUIDE",
}

// auth providers
// email  password
// google password authentication

export interface IAuthProvider {
  provider: "google" | "credentials"; // "Google" , "credential"
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: Role;
  phone ?: string;
  picture ?: string;
  address ?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
