import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Verified");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({
        email:verifiedToken.email,
      });

      if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User dose not exits");
      }
      if (
        isUserExists.isActive === IsActive.BLOCKED ||
        isUserExists.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `user is ${isUserExists.isActive}`
        );
      }
      if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      // if (!verifiedToken) {
      //   throw new AppError(403, "Not Token Authorize");
      // }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
