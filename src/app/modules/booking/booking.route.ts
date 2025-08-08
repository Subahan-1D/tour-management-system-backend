import express from "express";
import { checkAuth } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import { validatedRequest } from "../../middlewares/validatedRequest";
import {
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = express.Router();

// api/v1/booking
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validatedRequest(createBookingZodSchema),
  BookingController.createBooking
);

//api/v1/booking
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getAllBookings
);

// api/v1/booking/my-bookings
router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  BookingController.getUserBookings
);

//api/v1/booking/bookingId
router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingController.getSingleBooking
);

//api/v1/booking/bookingId/status

router.patch(
  "/bookingId/status",
  checkAuth(...Object.values(Role)),
  validatedRequest(updateBookingStatusZodSchema),
  BookingController.updateBookingStatus
);

export const BookingRoutes = router;
