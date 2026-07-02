import express from "express";
import { login, registerFirstAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", registerFirstAdmin); // only works once, before any admin exists

export default router;
