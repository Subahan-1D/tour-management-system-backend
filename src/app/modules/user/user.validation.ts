import { z } from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .nonempty("Name must be string")
    .min(2, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),

  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email must not exceed 100 characters" })
    .email({ message: "Invalid email address format" }),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    }),

  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, {
      message: "Please enter a valid Bangladeshi phone number with +880",
    })
    .optional(),

  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
});
export const updateUserZodSchema = z.object({
  name: z
    .string()
    .nonempty("Name must be string")
    .min(2, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" })
    .optional(),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    })
    .optional(),

  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, {
      message: "Please enter a valid Bangladeshi phone number with +880",
    })
    .optional(),

  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),

  //    SUPER_ADMIN = "SUPER_ADMIN",
  // USER = "USER",
  // ADMIN = "ADMIN",
  // GUIDE = "GUIDE",
  role: z.enum(Object.values(Role) as [string]).optional(),
  isDeleted: z
    .boolean({ error: "must be true or false" })
    .refine((val) => typeof val === "boolean", {
      message: "isDeleted must be true or false",
    })
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isVerified: z
    .boolean()
    .refine((val) => typeof val === "boolean", {
      message: "isVerified must be true or false",
    })
    .optional(),
});
