const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
};