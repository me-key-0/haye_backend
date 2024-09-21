const mongoose = require("mongoose");

const verificationCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Code = mongoose.model("Code", verificationCodeSchema);

module.exports = Code;
