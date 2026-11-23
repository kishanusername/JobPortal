import express from "express";
import { getCurrentUser, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { profileUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(profileUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getCurrentUser);
router.route("/profile/update").post(isAuthenticated,profileUpload,updateProfile);

export default router;

