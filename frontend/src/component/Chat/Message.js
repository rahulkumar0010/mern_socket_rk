import React, { useEffect, useRef } from "react";
import { getSocketChatData } from "../../controller/cookiesController";
import "./chatstyle.scss";
import moment from "moment";
// import SocketContext from "../../config/context";

const Message = ({ message = [], user }) => {
  const bottomRef = useRef();
  // const { socket } = useContext(SocketContext);

  let logedInUser = getSocketChatData()
    ? JSON.parse(getSocketChatData())
    : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="messages">
      <div className="time">Today</div>

      {message?.length > 0
        ? message?.map((res, i) => (
            <div
              key={i}
              className={`msg-text ${
                res.sender === logedInUser?._id ? "owner" : ""
              }`}
            >
              {res.type === "image" ? (
                <div className="image">
                  <img
                    src={"http://localhost:4001/" + res.image}
                    height={"100%"}
                    width={"100%"}
                    alt=""
                  />
                  <span className="img_msg_date">
                    {res.date ? moment(res.date).format("h:mm a") : ""}
                  </span>
                </div>
              ) : res.type === "audio" ? (
                <div className="audio">
                  <audio controls controlsList="nodownload">
                    <source
                      src={"http://localhost:4001/" + res.audio}
                      type="audio/mp3"
                    ></source>
                  </audio>
                  <span className="img_msg_date">
                    {res.date ? moment(res.date).format("h:mm a") : ""}
                  </span>
                </div>
              ) : (
                <div className="text">
                  <span style={{ display: "block", fontSize: "15px" }}>
                    {res.message ? res.message : null}
                  </span>
                  <span className="msg_date">
                    {res.date ? moment(res.date).format("h:mm a") : ""}
                  </span>
                </div>
              )}
            </div>
          ))
        : null}
      <div style={{ color: "#aebac1" }}>
        {user && user?._id === logedInUser?._id
          ? ""
          : user?.typing == "true"
          ? user?.name?.split(" ")[0] + " is typing..."
          : ""}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default Message;
