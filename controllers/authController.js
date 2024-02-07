const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otp_generator");
const sendMail = require("../utils/smtp_function");

module.exports = {
  createUser: async (req, res) => {
    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(req.body.email)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid email" });
      }

      const minPasswordLength = 8;
      if (req.body.password.length < minPasswordLength) {
        return res.status(400).json({
          status: false,
          message: `Password should be at least ${minPasswordLength} characters long`,
        });
      }

      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res
          .status(400)
          .json({ status: false, message: "Email already exists" });
      }

      const otp = generateOtp();

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        userType: "Client",
        password: CryptoJs.AES.encrypt(
          req.body.password,
          process.env.SECRET
        ).toString(),
        otp,
        phoneverification: req.body.phoneverification, // Set phoneverification
        phone: req.body.phone,
        verification: req.body.verification, // Set verification
      });

      await newUser.save();
      sendMail(newUser.email, otp);

      res
        .status(201)
        .json({ status: true, message: "User successfully created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  },

  loginuser: async (req, res) => {
    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(req.body.email)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid email" });
      }

      const minPasswordLength = 8;
      if (req.body.password.length < minPasswordLength) {
        return res.status(400).json({
          status: false,
          message: `Password should be at least ${minPasswordLength} characters long`,
        });
      }

      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "User not found" });
      }

      const decryptedPassword = CryptoJs.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const depassword = decryptedPassword.toString(CryptoJs.enc.Utf8);

      if (depassword !== req.body.password) {
        return res
          .status(400)
          .json({ status: false, message: "Wrong password" });
      }

      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Set expiration to 1 day
      );

      const { password, otp, address, createdAt, updatedAt, __v, ...others } =
        user._doc;

      res.status(200).json({ ...others, userToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  },
};
