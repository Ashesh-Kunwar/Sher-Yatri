import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  recordPayment,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public - customer submits an inquiry/booking from the website
router.post("/", createBooking);

// Admin
router.get("/", protect, adminOnly, getBookings);
router.get("/:id", protect, adminOnly, getBookingById);
router.put("/:id", protect, adminOnly, updateBooking);
router.post("/:id/payments", protect, adminOnly, recordPayment);

export default router;
