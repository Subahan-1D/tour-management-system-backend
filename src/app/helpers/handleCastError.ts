import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/errorTypes";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid mongodb ObjectId . Please provide valid _id",
  };
};