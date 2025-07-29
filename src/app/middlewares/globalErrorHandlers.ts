/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandlers = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * mongoose
   * zod
   */
  /**
   * mongodb
   * cast error
   * duplicate error
   * validation error
   */
  const errorSources: any = [
    // {
    //   path: "isDeleted",
    //   message: "Cast Failed",
    // },
  ];
  let statusCode = 500;
  let message = `Something went rong`;
  // duplicate error
  if (err.code === 11000) {
    console.log("Duplicate Error", err.message);

    const matchedArray = err.message.match(/"([^"]+)"/);
    statusCode = 400;
    message = `${matchedArray[1]} already exists.`;
  }
  // object error and castError
  else if (err.name === "CastError") {
    (statusCode = 400),
      (message = "Invalid mongodb ObjectId . Please provide valid _id");
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);
    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );
    message = err.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // err,
    stack: envVars.node_env === "development" ? err.stack : null,
  });
};
