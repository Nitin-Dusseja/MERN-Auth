import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, umique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOptExpireAt: { type: Number, default: 0 },
  idAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model("User", userSchema);

export default userModel;
