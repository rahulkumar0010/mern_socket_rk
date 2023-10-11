import React, { useCallback, useContext, useState } from "react";
import Sidenav from "./Sidenav";
import "./style.css";
import SearchIcon from "@mui/icons-material/Search";
import dummyUser from "../../assets/img/dummyUser.png";
import UpdateUser from "../UpdateUser";
import moment from "moment";
import _debounce from "lodash/debounce";
import SocketContext from "../../config/context";
import { getSocketChatData } from "../../controller/cookiesController";

const SideBar = ({ users = [], handleAdd, activeUser }) => {
  const { socket } = useContext(SocketContext);
  const [edit, setEdit] = useState(false);

  let logedInUser = getSocketChatData()
    ? JSON.parse(getSocketChatData())
    : null;

  const handleEdit = () => {
    setEdit(true);
  };
  const editOff = () => {
    setEdit(false);
  };

  const today = Date.now();
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const msgData = (date) => {
    if (date) {
      if (
        moment(today).format("YYYY MM DD") === moment(date).format("YYYY MM DD")
      ) {
        return "today";
      } else if (
        moment(yesterday).format("YYYY MM DD") ===
        moment(date).format("YYYY MM DD")
      ) {
        return "yesterday";
      } else {
        return moment(date).format("YYYY MM DD");
      }
    } else {
      return;
    }
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);

  async function handleDebounceFn(inputValue) {
    console.log("inputValue :", inputValue);
    await socket.emit("searchUser", {
      logInUser: logedInUser?._id,
      name: inputValue,
    });
  }

  return (
    <div className="container">
      {edit ? (
        <UpdateUser editOff={editOff} />
      ) : (
        <>
          <Sidenav handleEdit={handleEdit} />
          <div className="search_container">
            <div className="input_div">
              <SearchIcon
                style={{
                  marginTop: "5px",
                  marginLeft: "5px",
                  color: "#aebac1",
                }}
              />
              <input
                className="search_input"
                placeholder="Search or start new chat"
                onChange={(e) => debounceFn(e.target.value)}
              />
            </div>
          </div>
          {users
            ? users?.map((res) => (
                <>
                  <div
                    className={`user_container ${
                      activeUser?._id === res._id ? "active_user" : ""
                    }`}
                    key={res._id}
                    onClick={() => handleAdd(res._id, res?.phone)}
                  >
                    <div className="name_profile">
                      <div className="profile_img_div">
                        <img
                          src={
                            res.image
                              ? "http://localhost:4001/" + res?.image
                              : dummyUser
                          }
                          alt=""
                          className="userprofile_img"
                        />
                      </div>
                      <div className="username_div">
                        <div className="username">
                          <p>{res?.name ? res?.name : res?.phone}</p>
                        </div>
                        <div className="last_message">
                          <p>
                            {res.chat?.lastMessage
                              ? res.chat?.lastMessage?.message?.substring(0, 30)
                              : ""}
                            {res.chat?.lastMessage?.message?.length > 30 &&
                              "..."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="active_div">
                      <p>
                        {msgData(
                          res.chat?.lastMessage
                            ? res.chat?.lastMessage?.date
                            : ""
                        )}
                      </p>
                    </div>
                  </div>
                </>
              ))
            : null}
        </>
      )}
    </div>
  );
};

export default SideBar;
