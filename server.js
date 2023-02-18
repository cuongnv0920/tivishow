const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 5003;

// route
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const posterRoute = require("./routes/poster.route");
const videoRoute = require("./routes/video.route");
const calendarRoute = require("./routes/calendar.route");
const marginRoute = require("./routes/margin.route");
const exchangeRateRoute = require("./routes/exchageRate.route");
const depositRoute = require("./routes/deposit.route");

// Connect database mongodb
main()
  .then(() => console.log("database connected."))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.set("strictQuery", true);
  await mongoose.connect("mongodb://127.0.0.1:27017/branch_applications");
}

// use CORS
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// user routes
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/poster", posterRoute);
app.use("/video", videoRoute);
app.use("/calendar", calendarRoute);
app.use("/margin", marginRoute);
app.use("/exchangeRate", exchangeRateRoute);
app.use("/deposit", depositRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
