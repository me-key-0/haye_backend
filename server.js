const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const connectDb = require("./config/db");
app.use(cookieParser());

const port = process.env.PORT || 3030;

const server = app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

connectDb();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/users", require("./routes/usersRoute"));
app.use("/places", require("./routes/placesRoute"));
app.use("/events", require("./routes/eventsRoute"));
app.use("/api", require("./routes/reviewRoute"));
