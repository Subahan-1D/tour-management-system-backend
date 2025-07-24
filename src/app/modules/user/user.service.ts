/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { Role } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";
import bcryptjs from "bcryptjs";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authsProvider],
    ...rest,
  });
  return user;
};

// update user

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  if (payload.role) {
    /**
     * email can not update
     * name , phone , password , address
     * password - reHashing
     * promoting or super admin
     *only admin or super_admin - role isDeleted
     */
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You Are not Authorize");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You Are not Authorize");
    }
  }

  if (payload.isActive || payload.isActive || payload.isVerified) {
    if (decodedToken.role === Role.USER || Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You Are not Authorize");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const result = await User.find();
  const totalUsers = await User.countDocuments();

  return {
    data: result,
    meta: { total: totalUsers },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
