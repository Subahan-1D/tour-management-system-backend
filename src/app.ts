/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { success } from "zod";
import { envVars } from "./app/config/env";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandlers";
import "./app/config/passport";
import httpStatus from "http-status-codes";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
// data json pathano lagbe and must ata lagbe
// cors error jeno front-end developer na khai
const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// user.route.ts file theke import hobe

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management System",
  });
});

app.use(globalErrorHandlers);
app.use(notFound);

export default app;
