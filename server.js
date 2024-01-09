const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const mongoose = require("mongoose");
const CategoryRoute = require("./routes/category");

mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("foodly database connected"))
  .catch((err) => err);

app.get("/", (req, res) => res.send("Hello World!"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/category", CategoryRoute);
app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
