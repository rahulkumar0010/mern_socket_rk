const express = require("express");
const { PORT, JWT_SECRET } = require("./config");
const dbConnect = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const router = require("./routes");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
// const Buffer = require('buffer').Buffer

const {
  getAllUser,
  addUserToChat,
  getSingleUserForSocket,
} = require("./controllers/userController");
const {
  userForChat,
  getNewMessage,
  sendMessage,
  checkBeforeChat,
  updateTyping,
  sendVoiceMessage,
} = require("./controllers/chatController");

const app = express();

// DB Connection
dbConnect();

const port = PORT || 4001;

app.use(cors());
// support parsing of application/json type post data
app.use(express.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));

var server = http.createServer(app);

var io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.use("/uploads", express.static("uploads"));
app.use("/ChatAssets/chatImg", express.static("src/ChatAssets/chatImg"));
app.use("/ChatAssets/voiceChat", express.static("src/ChatAssets/voiceChat"));

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      JWT_SECRET,
      function (err, decoded) {
        if (err) return next(new Error("UnAuthorized"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", async (socket) => {
  socket.on("leave", (params) => {
    socket.leave(params.room);
  });
  socket.on("getAllOtherUser", async (params) => {
    socket.emit("getAllUser", await getAllUser(params));
  });
  socket.on("searchUser", async (params) => {
    socket.emit("getAllUser", await getAllUser(params.logInUser, params.name));
  });

  socket.on("addUserToChat", async (params, callback) => {
    let check = await checkBeforeChat(params.user);

    if (!check) {
      socket.join(params.roomId);
      await addUserToChat(params);
    } else {
      socket.join(check?.roomId);
    }
    socket.emit("getChatUser", await userForChat(params.user));
  });

  // socket.on("removeRoom", (room) => {
  //   console.log("leaveRoom :", room);
  //   socket.leave(room);
  //   socket.removeAllListeners(room + "-newMessage");
  // });

  socket.on("addNewMsg", async (params, callback) => {
    if (params.chat?.message) {
      await sendMessage(params);
      io.to(params.roomId).emit("getNewChat", params?.chat);
    }
  });
  // Image Chat
  socket.on("imageMsg", async (params, callback) => {
    const buffer = Buffer.from(
      params.msg.file?.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const imagePath = `ChatAssets/chatImg/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(params.msg.fileName)}`;
    fs.writeFileSync(path.resolve(__dirname, imagePath), buffer);

    await sendMessage(params, imagePath);
    io.to(params.roomId).emit("getNewChat", {
      type: params?.msg?.type,
      sender: params.msg.sender,
      receiver: params.msg.receiver,
      date: params?.msg?.date,
      image: imagePath,
    });
  });
  // Voice Chat
  socket.on("voiceMsg", async (params, callback) => {
    const buffer = Buffer.from(
      params.msg.file?.replace(/^data:audio\/(mp3);base64,/, ""),
      "base64"
    );
    const audioPath = `ChatAssets/voiceChat/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(params.name)}`;

    fs.writeFileSync(path.resolve(__dirname, audioPath), buffer);

    await sendVoiceMessage(params, audioPath);
    io.to(params.roomId).emit("getNewChat", {
      type: params?.msg?.type,
      sender: params.msg.sender,
      receiver: params.msg.receiver,
      date: params?.msg?.date,
      audio: audioPath,
    });
  });

  socket.on("updateTyping", async (params, callback) => {
    await updateTyping(params.user, params.type);

    // socket.emit("getChatUser", await userForChat(params.user));
    io.to(params.roomId).emit(
      "getUpdatedUser",
      await userForChat([params.user, params.chatUser])
    );
  });
});

app.use("/api/v1", router);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
