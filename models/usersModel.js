const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "owner", "admin"],
    default: "user",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
    },
  ],
  city: {
    type: String,
  },
  // emailVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  pwdToken: {
    type: String,
    required: false,
  },
  refToken: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
