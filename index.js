const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = 7000;

// connect database mongodb
const mongoURL = "mongodb://localhost:27017/tivishow";

mongoose.connect(mongoURL).then(
  () => console.log("Database connection established"),
  (err) => console.log("Database connection unestablied, error occurred")
);

// cookie parser
app.use(cookieParser());

// use CORS
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// routes API
const apiAuthRoutes = require("./api/routes/auth.route");
const apiUsers = require("./api/routes/user.route");
const apiRooms = require("./api/routes/room.route");
const apiPosters = require("./api/routes/poster.route");
const apiExchangeRate = require("./api/routes/exchageRate.route");
const apiAmlitude = require("./api/routes/amplitude.route");

// user routes
app.use("/api/auth", apiAuthRoutes);
app.use("/api/users", cors(), apiUsers);
app.use("/api/rooms", apiRooms);
app.use("/api/posters", apiPosters);
app.use("/api/exchangerates", apiExchangeRate);
app.use("/api/amplitudes", apiAmlitude);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
