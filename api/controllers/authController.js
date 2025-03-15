import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";

// the flow of this code is ⬇

// this function is for user registeration taking data from req.body and create user in database
export const register = async (req, res) => {
  // destructuing data from req.body
  const { name, email, password } = req.body;

  // checking variables are not null
  if (!name || !email || !password) {
    // if its null then the function is return with the this json message
    return res.json({ success: false, message: "Missing Details" });
  } // if everything is ok then

  try {
    // this line is checking that the user is allready is present in database before registration using email
    const existingUser = await userModel.findOne({ email });
    // if the user exist the existingUser is true
    if (existingUser) {
      //then the line return with this message
      return res.json({ success: false, message: "User Already Exists" });
    }
    //this line is bcrypt the password for security with bcrypt package and hash function
    // const hashPassword = await bcrypt.hash(password, 10);
    const hashPassword = bcrypt.hashSync(password, 10);

    //if everything is fine then the function is ready to create user in database
    const user = new userModel({ name, email, password: hashPassword });
    await user.save();
    // user has been created and stored in the database

    // generate token using JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    // send this token to user and store in client browser using cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.envNODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // days * hours * min * seconds * miliseconds
    });

    // sending welcome email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to Developers Group",
      text: `Welcome to Developers Group Your Account has been Created with this email Id :${email}`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail send successfully " + response);
      }
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Login function =========================================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email And Password Are Required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, Message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, Message: "Invalid Password" });
    }

    // generate token using JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    // send this token to user and store in client browser using cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.envNODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // days * hours * min * seconds * miliseconds
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, messgae: error.message });
  }
};

// Logout Function ================================================================
export const logout = async (req, res) => {
  try {
    const { userId } = req.body.userId;
    const user = await userModel.findOne(userId);
    user.idAccountVerified = false;
    user.verifyOtp = "";
    user.verifyOptExpireAt = 0;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.envNODE_ENV === "production" ? "none" : "Strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, messgae: error.message });
  }
};

// SendVerifyOtp function =================================================
export const sendVerifyOtp = async (req, res) => {
  try {
    // getting userId from client side
    const { userId } = req.body.userId;
    // finding the user in database using that userId
    const user = await userModel.findOne(userId);
    //checking the accountverified is true or false
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Accound is Already verified",
      });
    }
    // creating an OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    //store otp in database seperate for that user
    user.verifyOtp = otp;
    //set the expire time for the otp and store in database
    user.verifyOptExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // sending email otp verification
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
      } else {
        console.log("Mail send successfully " + response);
      }
    });

    return res.json({
      success: true,
      messgae: "Verification OTP is Send on your Email",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// VerifyEmail Function ==========================================================
export const verifyEmail = async (req, res) => {
  try {
    const { otp, userId } = req.body;
    if (!otp || !userId) {
      return res.json({ success: false, message: "Missing Detail" });
    }

    const user = await userModel.findOne(userId._id);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.idAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthentication = async (req, res) => {
  try {
    return res.json({ success: "true" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// sending otp for password reset
export const sendResetOTP = async (req, res) => {
  //getting email from req.body with destructure javascript method
  const { email } = req.body;

  // if email was not recived in that case this if statement will run and return response
  if (!email) {
    res.json({ success: false, message: "Email is Required" });
  }

  // for hundling other types of errors continue in try catch block
  try {
    // getting data from database(mongodb) using email id to find that user and findOne function from mongoose
    const user = await userModel.findOne({ email });
    // if user not Found in Database
    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }
    // creating an OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    //store otp in database seperate for that user
    user.resetOtp = otp;
    //set the expire time for the otp and store in database
    user.resetOptExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    // sending email otp verification
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. for Resetting You Password Your OTP will Expired in 15 min.`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail send successfully " + response);
      }
    });

    return res.json({ success: true, message: "OTP is Send to Your Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// reset Password Function
export const resetPassword = async (req, res) => {
  // destructuring email, otp, and New Password from requset body
  const { email, otp, newPassword } = req.body;
  // if Something is missing from this three parameters then this statement return response
  if (!email || !otp || !newPassword) {
    res.json({
      success: false,
      message: "Email, OTP and new Password are required",
    });
  }
  try {
    // find the use dfrom the database using email (the email is string type and the function want object to search from the database so the simplest thing we do to convert email into object is {email})
    const user = await userModel.findOne({ email });
    if (!user) {
      // if user is not found in database
      res.json({ success: false, message: "User Not Found" });
    }
    // the otp checker
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    // Expire checker
    if (user.resetOptExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    // convert newpassword into hashed Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    //  change the value of that user in this object
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOptExpireAt = 0;
    //save the user in database
    await user.save();

    return res.json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
