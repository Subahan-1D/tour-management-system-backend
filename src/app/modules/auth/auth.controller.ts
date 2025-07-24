/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialsLogin(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: " User Logged Successfully",
      success: true,
      data: loginInfo,
    });
  }
);

export const authControllers = {
  credentialsLogin,
};
