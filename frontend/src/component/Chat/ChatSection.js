import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatNav from "./ChatNav";
import "./style.css";
import { getSocketChatData } from "../../controller/cookiesController";
import welcomeImg from "../../assets/img/welcome_bot.jpg";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MicOffIcon from "@mui/icons-material/MicOff";

import _debounce from "lodash/debounce";
import Picker from "emoji-picker-react";
import SocketContext, { UserContext } from "../../config/context";
import Message from "./Message";

import MicRecorder from "mic-recorder-to-mp3";
import { errorMsg } from "../../controller/ToastController";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const ChatSection = ({ setActiveUser }) => {
  const fileInputRef = useRef();
  const { socket } = useContext(SocketContext);
  const { state, dispatch } = useContext(UserContext);
  const [typeMsg, setTypeMsg] = useState(null);
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [counter, setCounter] = useState(0);

  let logedInUser = getSocketChatData()
    ? JSON.parse(getSocketChatData())
    : null;

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setIsBlocked(false);
      },
      () => {
        console.log("Permission Denied");
        setIsBlocked(true);
      }
    );
  }, []);
  useEffect(() => {
    socket.on("getChatUser", (data) => {
      const chatUser = data?.user?.find((res) => res._id !== logedInUser?._id);

      setUser(chatUser);
      setActiveUser(chatUser);
      setRoomId(data?.roomId);
      dispatch({
        type: "ROOMID",
        payload: data?.roomId,
      });
      setMessage(data?.chat);
      setTypeMsg("");
    });
    return () => socket.off("getChatUser");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, logedInUser]);

  const handleSubmitChat = async (event) => {
    event.preventDefault();
    const data = {
      roomId: state?.roomIdG,
      chat: {
        message: typeMsg,
        sender: logedInUser?._id,
        receiver: user?._id,
        date: Date.now(),
      },
    };
    await socket.emit("updateTyping", {
      user: logedInUser?._id,
      chatUser: user._id,
      type: false,
      roomId:state?.roomIdG,
    });
    await socket.emit("addNewMsg", data);
    setTypeMsg("");
    socket.on("getUpdatedUser", (data) => {
      const chatUser = data?.user?.find((res) => res._id !== logedInUser?._id);

      setUser(chatUser);
      setActiveUser(chatUser);
      setRoomId(data?.roomId);
      dispatch({
        type: "ROOMID",
        payload: data?.roomId,
      });
      setMessage(data?.chat);
    });
  };

  useEffect(() => {
    socket.on("getNewChat", (data) => {
      setMessage((prev) => [...prev, data]);
      socket.emit("getAllOtherUser", logedInUser?._id);
    });
    // Remove event listener on component unmount
    return () => socket.off("getNewChat");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);

  async function handleDebounceFn() {
    await socket.emit("updateTyping", {
      user: logedInUser?._id,
      chatUser: user?._id,
      type: false,
      roomId:state?.roomIdG,
    });
    socket.on("getUpdatedUser", (data) => {
      const chatUser = data?.user?.find((res) => res._id !== logedInUser?._id);

      setUser(chatUser);
      setActiveUser(chatUser);
      setRoomId(data?.roomId);
      dispatch({
        type: "ROOMID",
        payload: data?.roomId,
      });
      setMessage(data?.chat);
    });
  }

  const handleChange = (e) => {
    const target = e.target;
    setTypeMsg(target.value);

    socket.emit("updateTyping", {
      user: logedInUser?._id,
      chatUser: user._id,
      type: true,
      roomId:state?.roomIdG,
    });
    debounceFn();
    socket.on("getUpdatedUser", (data) => {
      const chatUser = data?.user?.find((res) => res._id !== logedInUser?._id);

      setUser(chatUser);
      setActiveUser(chatUser);
      setRoomId(data?.roomId);
      dispatch({
        type: "ROOMID",
        payload: data?.roomId,
      });
      setMessage(data?.chat);
    });
  };
  const onEmojiClick = (event, emojiObject) => {
    setTypeMsg((prevInput) => prevInput + emojiObject.emoji);
    // setShowPicker(false);
  };
  const photoChange = async (e) => {
    var reader = new FileReader();
    reader.onload = function (evt) {
      var msg = {};
      msg.type = "image";
      msg.file = evt.target.result;
      msg.fileName = e.target.files[0]?.name;
      msg.sender = logedInUser?._id;
      msg.receiver = user?._id;
      msg.date = Date.now();

      socket.emit("imageMsg", {
        roomId:state?.roomIdG,
        msg,
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  // Audio record function

  useEffect(() => {
    let intervalId;

    if (isRecording) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter((counter) => counter + 1);
      }, 650);
    }

    return () => clearInterval(intervalId);
  }, [isRecording, counter]);

  const start = () => {
    if (isBlocked) {
      console.log("Permission Denied");
      errorMsg("Please allow microphone permission");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e) => console.error(e));
    }
  };
  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, `audio.mp3`, {
          type: blob.type,
          lastModified: Date.now(),
        });

        var reader = new FileReader();
        reader.onload = function (evt) {
          var msg = {
            type: "audio",
            file: evt.target.result,
            sender: logedInUser?._id,
            receiver: user?._id,
            date: Date.now(),
          };

          socket.emit("voiceMsg", {
            roomId:state?.roomIdG,
            name: file?.name,
            msg,
          });
        };
        reader.readAsDataURL(file);

        setIsRecording(false);
        setCounter(0);
        setSecond("00");
        setMinute("00");
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="container">
      {user ? (
        <div style={{ position: "initial" }}>
          <ChatNav user={user} />
          <div className="message_container">
            <Message message={message} user={user} />
          </div>
          {showPicker && (
            <div style={{ position: "absolute", bottom: "65px  " }}>
              <Picker
                pickerStyle={{ width: "100%" }}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}

          <div className="chat_bottom_container">
            {isRecording && (
              <div style={{ fontSize: "24px" }} className="recordingContainer">
                <span className="minute">{minute}</span>
                <span>:</span>
                <span className="second">{second}</span>
              </div>
            )}
            {!isRecording && (
              <div className="emoji_icon">
                {showPicker ? (
                  <ExpandMoreIcon
                    style={{
                      color: "#aebac1",
                      marginRight: "15px",
                      fontSize: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPicker((val) => !val)}
                  />
                ) : (
                  <InsertEmoticonIcon
                    style={{
                      color: "#aebac1",
                      marginRight: "15px",
                      fontSize: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPicker((val) => !val)}
                  />
                )}

                <InsertPhotoIcon
                  style={{
                    color: "#aebac1",
                    fontSize: "30px",
                    cursor: "pointer",
                  }}
                  onClick={() => fileInputRef.current.click()}
                />
              </div>
            )}
            <input
              onChange={photoChange}
              accept="image/*"
              multiple={false}
              ref={fileInputRef}
              type="file"
              hidden
            />
            {!isRecording && (
              <form onSubmit={handleSubmitChat} className="chat_input_div">
                <input
                  className="chat_input"
                  placeholder="Type a message"
                  value={typeMsg}
                  onChange={handleChange}
                />
              </form>
            )}

            <div className="mike">
              {isRecording ? (
                <MicOffIcon
                  style={{
                    color: "#aebac1",
                    fontSize: "30px",
                    cursor: "pointer",
                  }}
                  onClick={stop}
                  disabled={!isRecording}
                />
              ) : (
                <KeyboardVoiceIcon
                  style={{
                    color: "#aebac1",
                    fontSize: "30px",
                    cursor: "pointer",
                  }}
                  onClick={start}
                  disabled={isRecording}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="welcome_bot_container">
          <div>
            <div className="welcome_bot_div">
              <img src={welcomeImg} alt="" className="welcome_bot_img" />
            </div>
            <h1>
              Welcome {logedInUser?.name ? logedInUser?.name.split(" ")[0] : ""}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
