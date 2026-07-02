import express from "express";
import {
  getTours,
  getTourBySlug,
  getAllToursAdmin,
  getTourByIdAdmin,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", getTours);
router.get("/:slug", getTourBySlug);

// Admin
router.get("/admin/all", protect, adminOnly, getAllToursAdmin);
router.get("/admin/:id", protect, adminOnly, getTourByIdAdmin);
router.post("/", protect, adminOnly, createTour);
router.put("/:id", protect, adminOnly, updateTour);
router.delete("/:id", protect, adminOnly, deleteTour);

export default router;
