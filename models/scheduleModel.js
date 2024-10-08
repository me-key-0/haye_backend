const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    Date: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
