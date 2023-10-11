const Chat = require("../models/Chat");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const errorFunction = require("../utils/errorFunction");

async function checkBeforeChat(data) {
  try {
    let user = await Chat.findOne({ user: { $all: data } });

    return user;
  } catch (error) {
    new Error(error.message);
  }
}
async function userForChat(data) {
  try {
    let user = await Chat.findOne({ user: { $all: data } })
      .populate("user")
      .select("-__v");
    return user;
  } catch (error) {
    new Error(error.message);
  }
}
// Multer Setup For Image upload
// Image Upload with multer
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "image"
);

async function sendMessage(data, image) {
  try {
    if (data?.msg?.type && data?.msg?.type === "image") {
      try {
        //Store into Database
        return await Chat.updateOne(
          { roomId: data.roomId },
          {
            $push: {
              chat: {
                sender: data.msg.sender,
                receiver: data.msg.receiver,
                date: data?.msg?.date,
                type: data?.msg?.type,
                ...(image && { image }),
              },
            },
          },
          { new: true }
        );
      } catch (error) {
        return error.message;
      }
    }

    const result = await Chat.updateOne(
      { roomId: data.roomId },
      { $push: { chat: { ...data.chat } } }
    );
    return result;
  } catch (error) {
    return error.message;
  }
}
async function sendVoiceMessage(data, audio) {
  console.log(data, audio);
  try {
    //Store into Database
    return await Chat.updateOne(
      { roomId: data.roomId },
      {
        $push: {
          chat: {
            sender: data.msg.sender,
            receiver: data.msg.receiver,
            date: data?.msg?.date,
            type: data?.msg?.type,
            ...(audio && { audio }),
          },
        },
      },
      { new: true }
    );
  } catch (error) {
    return error.message;
  }
}
async function getNewMessage(data) {
  try {
    let result = await Chat.findOne({ roomId: data.roomId });
    return result;
  } catch (error) {
    return error.message;
  }
}
async function updateTyping(data, value) {
  try {
    let result = await User.findByIdAndUpdate(
      data,

      { typing: value }
    );

    return result;
  } catch (error) {
    return error.message;
  }
}

async function clearChat(req, res) {
  try {
    const result = await Chat.updateOne(
      { roomId: req.params.roomId },
      { $set: { chat: [] } },
      { new: true }
    );
    res.json({ message: "Chat clear successfully", result });
  } catch (error) {
    return res
      .status(500)
      .json(
        errorFunction(true, `Error in clear chat catch : ${error.message}`)
      );
  }
}

module.exports = {
  checkBeforeChat,
  userForChat,
  sendMessage,
  getNewMessage,
  updateTyping,
  sendVoiceMessage,
  clearChat,
};
