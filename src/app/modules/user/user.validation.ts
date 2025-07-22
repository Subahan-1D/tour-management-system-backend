import z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
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
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(passwordRegex, {
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
