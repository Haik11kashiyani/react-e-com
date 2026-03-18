import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import process from "process";

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized — no token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized — token invalid" });
  }
};

export default auth;
