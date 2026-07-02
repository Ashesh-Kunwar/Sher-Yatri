import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSettings); // public site needs this too (name, logo, contact)
router.put("/", protect, adminOnly, updateSettings);

export default router;
