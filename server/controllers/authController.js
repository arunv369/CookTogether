const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "email not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password  " });

    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic,
        savedRecipe: user.savedRecipe,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.verifyToken = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ msg: "No token, unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User does not exist" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 Hour Expiry

  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.json({ msg: "Password reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
  res.json({ msg: "Password updated successfully" });
};
