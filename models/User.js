const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: false, default: "none" },
    password: { type: String, required: true },
    verification: { type: Boolean, required: false },
    phone: { type: String, default: "0123456789" },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: "false",
    },
    userType: {
      type: String,
      required: true,
      default: "Client",
      enum: ["Admin", "Vendor", "Vendor", "Driver"],
    },
    profile: {
      type: String,
      default:
        "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
