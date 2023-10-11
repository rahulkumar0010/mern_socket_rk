import React, { useEffect } from "react";
import MoreMenu from "../MoreMenu";
import dummyUser from "../../assets/img/dummyUser.png";
import {
  getSocketChatData,
  removeAccessToken,
  removeSocketChatData,
} from "../../controller/cookiesController";
import { useNavigate } from "react-router-dom";
import { getSingleUser, updateUserStatus } from "../../utils/APICall";

const Sidenav = ({ handleEdit }) => {
  const history = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = React.useState(null);
  let logedInUser = getSocketChatData()
    ? JSON.parse(getSocketChatData())
    : null;

  useEffect(() => {
    getSingleUser(logedInUser?._id, setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = ["Logout"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const optionHandler = async () => {
    await removeAccessToken();
    await removeSocketChatData();
    await updateUserStatus(logedInUser?._id, { status: "offline" });
    setTimeout(() => {
      history("/login");
    }, 500);
  };

  return (
    <div className="sidenav_container">
      <div>
        <p className="profile_img_div" onClick={handleEdit}>
          <img
            src={
              user && user.image
                ? "http://localhost:4001/" + user?.image
                : dummyUser
            }
            alt=""
            className="profile_img"
          />
        </p>
      </div>
      <div>
        <MoreMenu
          anchorEl={anchorEl}
          handleClick={handleClick}
          handleClose={handleClose}
          options={options}
          optionHandler={optionHandler}
        />
      </div>
    </div>
  );
};

export default Sidenav;
