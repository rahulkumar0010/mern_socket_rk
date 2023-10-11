const Joi = require("joi");
const securePassword = require("../utils/hashPassword");
const User = require("../models/User");
const errorFunction = require("../utils/errorFunction");
const bcrypt = require("bcryptjs");
const Chat = require("../models/Chat");
// const Jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/JwtServices");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

async function register(req, res, next) {
  // JOI validation
  const validation = Joi.object({
    name: Joi.string().trim(true).required(),
    phone: Joi.string().trim(true).required(),
    password: Joi.string().required("Password is required"),
  });
  const { error } = validation.validate(req.body);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Register : ${error.message}`)
    );
  }
  const hashedPassword = await securePassword(req.body.password);

  let user = new User({
    name: req.body.name,
    phone: req.body.phone,
    password: hashedPassword,
  });

  try {
    const exist = await User.findOne({ phone: req.body.phone });
    if (exist) {
      return res
        .status(401)
        .json({ message: `${req.body.phone} already exist` });
    }
    let result = await user.save();
    let accessToken = await generateToken({ _id: result._id });
    res
      .status(200)
      .json({ message: "Successfully Register", data: result, accessToken });
  } catch (error) {
    return res
      .status(408)
      .json(
        errorFunction(true, `Error in User Register catch : ${error.message}`)
      );
  }
}

// Login Controller
async function login(req, res) {
  // JOI validation
  const validation = Joi.object({
    phone: Joi.string().trim(true).required(),
    password: Joi.string().trim(true).required(),
  });
  const { error } = validation.validate(req.body);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User login : ${error.message}`)
    );
  }
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const compare = await bcrypt.compare(req.body.password, user.password);
    if (!compare) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    let accessToken = await generateToken({ _id: user._id });
    res.status(200).json({
      message: "Login Successfully",
      user: { _id: user._id, name: user.name, phone: user.phone },
      accessToken,
    });
  } catch (error) {
    return res
      .status(408)
      .json(
        errorFunction(true, `Error in User Register catch : ${error.message}`)
      );
  }
}

// Get All User
async function getAllUser(data, name) {
  try {
    // let result=   await User.find({ _id: { $ne: data } }).select("-__v -password -updatedAt");

    let result = await User.aggregate([
      { $match: { _id: { $ne: mongoose.Types.ObjectId(data) } } },
      {
        $match: name
          ? {
              name: { $regex: name, $options: "i" },
            }
          : {},
      },
      {
        $lookup: {
          from: "chats", // other table name
          let: { userId: "$_id" }, // name of user table field
          as: "chat",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$userId", "$user"] },
                    { $in: [mongoose.Types.ObjectId(data), "$user"] },
                  ],
                },
              },
              // $match: {
              //   user: { $in: [ "$$userId"] },
              //   // $expr: { $in: [mongoose.Types.ObjectId(data), "$user"] },
              //   // $expr: {
              //   //   $eq: ["$$userId", mongoose.Types.ObjectId(data)],
              //   // },
              // },
            },

            { $project: { id: 1, lastMessage: { $slice: ["$chat", -1] } } },
          ],
        },
        // $match: {
        //   "$chat.user": { $all: [mongoose.Types.ObjectId(data), "$_id"] },
        // },
      },

      // {
      //   $addFields: {
      //     chat: { $slice: ["$chat.chat", -1] },
      //   },
      // },
      { $unwind: { path: "$chat", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$chat.lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { "chat.lastMessage.date": -1 } },
    ]);

    return result;
  } catch (error) {
    return error.message;
  }
}
// Add User to chat
async function addUserToChat(data) {
  const user = new Chat({ user: data.user, roomId: data.roomId });
  try {
    let userExist = await Chat.findOne({
      user: { $all: data.user },
    });
    if (userExist) {
      return userExist;
    }

    return await user.save();
  } catch (error) {
    return error.message;
  }
}

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

// Update user profile
async function updateUser(req, res) {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Something went wrong !" });
      }
      const filePath = req.file ? req.file.path : "";

      const { name, about } = req.body;
      try {
        //Store into Database
        await User.findByIdAndUpdate(req.params.id, {
          name,
          about,
          ...(req.file && { image: filePath }),
        });
      } catch (error) {
        return res.status(405).json({
          message: "Something went wrong!",
          originError: error.message,
        });
      }
      res.status(200).json({ message: "Updated successfully" });
    });
  } catch (error) {
    return res
      .status(405)
      .json({ message: "Something went wrong!", originError: error.message });
  }
}

async function updateUserStatus(req, res) {
  try {
    const result = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ message: "Updated successfully", data: result });
  } catch (error) {
    return res
      .status(405)
      .json({ message: "Something went wrong!", originError: error.message });
  }
}

async function getSingleUser(req, res) {
  try {
    let user = await User.findOne({ _id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    return res.status(405).json({
      message: "Something went wrong!",
      originError: error.message,
    });
  }
}
async function getSingleUserForSocket(id) {
  try {
    let user = await User.findOne({ _id: id });

    return user;
  } catch (error) {
    new Error(error.message);
  }
}

module.exports = {
  register,
  login,
  getAllUser,
  addUserToChat,
  updateUser,
  getSingleUser,
  getSingleUserForSocket,
  updateUserStatus,
};
