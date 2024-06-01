// user.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: false, default: "none" },
    fcm: { type: String, required: false, default: "none" },
    password: { type: String, required: true },
    phoneverification: { type: Boolean, required: false, default: false },
    phone: { type: String, default: "0123456789" },
    verification: { type: Boolean, required: false, default: false },
    userType: {
      type: String,
      required: true,
      default: "Client",
      enum: ["Client", "Admin", "Vendor", "Driver"],
    },
    profile: {
      type: String,
      default:
        "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
    },
    uid: { type: String, required: false },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
