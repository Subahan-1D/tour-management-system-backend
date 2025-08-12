/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialsLogin(req.body);

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        // return next(err);
        return next(new AppError(401, err));
      }

      if (!user) {
        // return new AppError(401, info.message);
        return next(new AppError(401, info.message));
      }

      const userTokens = await createUserTokens(user);

      delete user.toObject().password;
      const { password: pass, ...rest } = user.toObject();
      setAuthCookie(res, userTokens);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        message: " User Logged Successfully",
        success: true,
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }
    const tokenInfo = await authServices.getNewAccessToken(
      refreshToken as string
    );
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: " New Access Token Retrive Successfully",
      success: true,
      data: tokenInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: " User logout Successfully",
      success: true,
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const decodedToken = req.user as JwtPayload;
    await authServices.setPassword(decodedToken.userId, password);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Password Change successfully",
      success: true,
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    await authServices.resetPassword(req.body, decodedToken as JwtPayload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Password Change successfully",
      success: true,
      data: null,
    });
  }
);
const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await authServices.forgotPassword(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Email Send Csuccessfully",
      success: true,
      data: null,
    });
  }
);
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await authServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Password Change successfully",
      success: true,
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = typeof req.query.state === "string" ? req.query.state : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    console.log(user);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "user dose not found");
    }
    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONT_END_URL}/${redirectTo}`);
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  resetPassword,
  forgotPassword,
  setPassword,
  googleCallbackController,
};
