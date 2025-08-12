/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();

router.post("/login", authControllers.credentialsLogin);
router.post("/refresh-token", authControllers.getNewAccessToken);
router.post("/logout", authControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authControllers.changePassword
);

router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  authControllers.setPassword
);
router.post("/forgot-password",authControllers.forgotPassword);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authControllers.resetPassword
);
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);
// Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=subahanislam523@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password   
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONT_END_URL}/login?error=There is some issue. with your account.please contact with our support team`,
  }),
  authControllers.googleCallbackController
);

export const AuthRoutes = router;
