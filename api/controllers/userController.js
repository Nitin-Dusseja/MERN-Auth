import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      res.json({ success: false, message: "User not Found" });
    }

    res.json({
      success: true,
      userdata: {
        name: user.name,
        idAccountVerified: user.idAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
