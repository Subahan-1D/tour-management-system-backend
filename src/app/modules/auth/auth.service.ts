import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email dose not exits");
  }
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExists.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  // jwt token
  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRED
  );
  return {
    accessToken,
  };
};

export const authServices = {
  credentialsLogin,
};
