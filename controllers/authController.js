const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otp_generator");
const sendMail = require("../utils/smtp_function");
module.exports = {
  createUser: async (req, res) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(req.body.email)) {
      return res
        .status(400)
        .json({ status: false, message: "Email is not valid" });
    }

    const minPasswordLength = 8;

    if (req.body.password < minPasswordLength) {
      return res.status(400).json({
        status: false,
        message:
          "Password shuld be at least" + minPasswordLength + "character long",
      });
    }
    try {
      const emailExists = await User.findOne({ emaill: req.body.email });

      if (emailExists) {
        return res
          .status(400)
          .json({ status: false, message: "Email alredy exists" });
      }

      //GENERATE OTP
      const otp = generateOtp();

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        userType: "Client",
        password: CryptoJs.AES.encrypt(
          req.body.password,
          password.env.SECRET
        ).toString(),
        otp: otp,
      });
      //SAVE USER
      await newUser.save();

      //SEND OTP TO EMAIL

      sendMail(newUser.email, otp);

      res
        .status(201)
        .json({ status: true, message: "USer Successfully created" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  loginuser: async (req, res) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(req.body.email)) {
      return res
        .status(400)
        .json({ status: false, message: "Email is not valid" });
    }

    const minPasswordLength = 8;

    if (req.body.password < minPasswordLength) {
      return res.status(400).json({
        status: false,
        message:
          "Password shuld be at least" + minPasswordLength + "character long",
      });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "User not found" });
      }
      const decryptedPassword = CryptoJs.decrypt(
        user.password,
        process.env.SECRET
      );
      const depassword = decryptedPassword.toString(CryptoJs.enc.Utf8);

      if (depassword === req.body.password) {
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
        { expiresIn: "21d" }
      );
      const { password, otp, ...others } = user.doc;
      res.status(200).json({ ...others, userToken });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
