const express = require("express");
const cookieParser = require("cookie-parser");
const { usersRoute } = require("./routes/usersRoute");
const cors = require("cors");
require("dotenv").config();

const app = express();
const connectDb = require("./config/db");
app.use(cookieParser());

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

connectDb();
app.use(cors());
app.use(express.json());
app.use("/users", require("./routes/usersRoute"));
app.use("/places", require("./routes/placesRoute"));
app.use("/events", require("./routes/eventsRoute"));
app.use('/api', require('./routes/reviewRoutes'));


