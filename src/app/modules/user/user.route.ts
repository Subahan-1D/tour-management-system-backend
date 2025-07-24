/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import {
  validatedRequest,
  validatedResponse,
} from "../../middlewares/validatedRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/authCheck";
const router = Router();

router.post(
  "/register",
  validatedResponse(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
);
router.patch(
  "/:id",
  validatedRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
//api/v1/user/:id
export const UserRoutes = router;
