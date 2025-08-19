import userModel from "../models/user.model.js";
const isAdmin = async (req, res, next) => {
  try {
    const reqObject = req.params;
    if (!reqObject.userId) {  
      throw new Error("user ID not found");
    }
    const userId = reqObject.userId;
    const foundUser = await userModel.findById(userId);
    if (foundUser.isAdmin === false) {
      throw new Error("permission denied");
    }
    next();
  } catch (error) {
    console.log("something happened in isadmin section of middleware");
    next(error);
  }
};
export default isAdmin;
