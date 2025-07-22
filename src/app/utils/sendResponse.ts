import { Response } from "express";
import { success } from "zod";

interface TMeta {
  total: number;
}

interface TResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
  meta?: TMeta;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    message: data.message,
    success: data.success,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;
