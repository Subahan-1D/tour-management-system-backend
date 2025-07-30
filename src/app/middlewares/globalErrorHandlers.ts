/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/errorTypes";

export const globalErrorHandlers = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.node_env === "development") {
    console.log(err);
  }
  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = `Something went rong`;
  // duplicate error
  if (err.code === 11000) {
    const simplefiedError = handleDuplicateError(err);
    statusCode = simplefiedError.statusCode;
    message = simplefiedError.message;
  }
  // object error and castError
  else if (err.name === "CastError") {
    const simplefiedCastError = handleCastError(err);
    statusCode = simplefiedCastError.statusCode;
    message = simplefiedCastError.message;
  }
  // mongoose validation error
  else if (err.name === "ZodError") {
    const simplefiedZodError = handleZodError(err);
    statusCode = simplefiedZodError.statusCode;
    message = simplefiedZodError.message;
    errorSources = simplefiedZodError.errorSources as TErrorSources[];
  } else if (err.name === "ValidationError") {
    const simplefiedValidationError = handleValidationError(err);

    statusCode = simplefiedValidationError.statusCode;
    errorSources = simplefiedValidationError.errorSources as TErrorSources[];
    message = simplefiedValidationError.message;
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
    err: envVars.node_env === "development" ? err : null,
    stack: envVars.node_env === "development" ? err.stack : null,
  });
};
