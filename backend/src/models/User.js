const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String, required: false },
    typing: { type: String, default: false },

    status: { type: String, default: "offline" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userModel);
