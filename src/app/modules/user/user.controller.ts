/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("fake error")
//     // throw new AppError(httpStatus.BAD_REQUEST, "fake error");
//     const user = await UserServices.createUser(req.body);
//     res.status(httpStatus.CREATED).json({
//       message: "User Created Successfully!!",
//       user,
//     });
//   } catch (err: any) {
//     // eslint-disable-next-line no-console
//     console.log(err), next(err);
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   message: "User Created Successfully",
    //   user,
    // });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: " User Created Successfully",
      success: true,
      data: user,
    });
  }
);
// updated user
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: " User updated Successfully",
      success: true,
      data: user,
    });
  }
);

// const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await UserServices.getAllUsers();
//     return users;
//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All User Retrieve Successfully",
    //   data: users,
    // });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "All User Retrieve Successfully",
      success: true,
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
};

// 1st time bujar jonno

// route-matching ---> controller ---> service --> model --> DB

// 2nd time korar somoi vinno hobe
