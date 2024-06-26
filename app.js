const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000; // Added default port
const mongoose = require("mongoose");
const CategoryRoute = require("./routes/category");
const RestaurantRoute = require("./routes/restaurant");
const FoodRoute = require("./routes/food");
const RatingRoute = require("./routes/rating");
// const sendEmail = require("./utils/smtp_function");
// const generateOtp = require("./utils/otp_generator");
const AuthRoute = require("./routes/auth");
const UserRoute = require("./routes/user");
const AddressRoute = require("./routes/address");
const OrderRoute = require("./routes/order");
const CartRoute = require("./routes/cart");
mongoose
  .connect(process.env.MONGOURL, {})
  .then(() => console.log("foodly database connected"))
  .catch((err) => console.error(err));

// // const otp = generateOtp();

// // console.log(otp);

// sendEmail("samitshrestha20@gmail.com", otp);

app.get("/", (req, res) => res.send("Hello World!"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/restaurant", RestaurantRoute);
app.use("/api/foods", FoodRoute);
app.use("/api/rating", RatingRoute);
app.use("/api/address", AddressRoute);
app.use("/api/cart", CartRoute);
app.use("/api/order", OrderRoute);
app.listen(port, () =>
  console.log(`Example app listening on port 192.168.1.86:${port}`)
);
