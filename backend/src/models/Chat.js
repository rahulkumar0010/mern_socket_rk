const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    chat: [
      {
        message: { type: String, required: false },
        image: { type: String, required: false },
        audio: { type: String, required: false },
        sender: { type: Schema.Types.ObjectId, required: false },
        receiver: { type: Schema.Types.ObjectId, required: false },
        type: { type: String, default: "text" },
        read: { type: String, default: false },
        date: { type: Date, default: Date.now },
      },
    ],

    
    roomId: { type: String, required: false },
    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Chat", chatSchema);
