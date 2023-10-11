import React, { useContext, useEffect, useState } from "react";
import SocketContext, { UserContext } from "../config/context";
import { v4 as uuidv4 } from "uuid";
import LayoutContainer from "../component/LayoutContainer";
import SideBar from "../component/SideBar";
import ChatSection from "../component/Chat/ChatSection";
import { getSocketChatData } from "../controller/cookiesController";
import { errorMsg } from "../controller/ToastController";

function Home() {
  const { socket } = useContext(SocketContext);
  const { state } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  // const [logedInUser, setLogedInUser] = useState(null);
  let loggedUser = getSocketChatData() ? JSON.parse(getSocketChatData()) : null;
  // useEffect(() => {
  // setLogedInUser(loggedUser);
  // const location = window.navigator && window.navigator.geolocation;
  // if (location) {
  //   location.getCurrentPosition(
  //     (position) => {
  //       console.log({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });
  //     },
  //     (error) => {
  //       console.log({ latitude: "err-latitude", longitude: "err-longitude" });
  //     }
  //   );
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    // console.log("State :", state)
    // let interval = setInterval(() => {
    state?.logInUser
      ? socket.emit("getAllOtherUser", state?.logInUser?._id)
      : loggedUser && socket.emit("getAllOtherUser", loggedUser?._id);
    // }, 1000);
    socket.on("getAllUser", (data) => {
      setUsers(data);
    });

    socket.on("error", (err) => {
      console.log("error socket :", err);
    });
    socket.on("connect_error", (err) => {
      // console.log(err.message); // <-- error we're trying to log
      if (err.message) errorMsg(err.message);
    });
    // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, state]);

  socket.on("disconnect", () => {
    console.log("Disconnect", socket.id); // undefined
  });

  const handleAdd = async (id, phone) => {
    socket.emit("addUserToChat", {
      user: [id, loggedUser?._id],
      roomId: uuidv4(),
    });
    // removeRoom
    // if (state?.roomIdG) {
    //   await socket.emit("removeRoom", state?.roomIdG);
    // }
  };

  return (
    <div>
      <LayoutContainer
        left={
          <SideBar
            users={users}
            handleAdd={handleAdd}
            activeUser={activeUser}
          />
        }
        right={<ChatSection setActiveUser={setActiveUser} />}
      />
    </div>
  );
}

export default Home;
