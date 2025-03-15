import express from "express";
import {
  isAuthentication,
  login,
  logout,
  register,
  resetPassword,
  sendResetOTP,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userAuth, logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthentication);
authRouter.post("/send-reset-otp", sendResetOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
