import React from "react";
import dummyUser from "../../assets/img/dummyUser.png";
import SearchIcon from "@mui/icons-material/Search";
import MoreMenu from "../MoreMenu";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const ChatNav = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const options = ["Clear Chat", "Delete Chat"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const optionHandler = (data) => {
    console.log("Optional data :", data);
  };

  // console.log("user :", user);

  return (
    <div className="chatnav_container">
      <div className="name_profile">
        <div className="profile_img_div">
          <img
            src={
              user?.image ? "http://localhost:4001/" + user.image : dummyUser
            }
            alt=""
            className="userprofile_img"
          />
        </div>
        <div className="username_div">
          <div className="username">
            <p>{user?.name ? user?.name : user?.phone ? user?.phone : "N/A"}</p>
          </div>
          <div className="last_message">
            <p>
              {user?.status ? (
                user?.status === "online" ? (
                  <div className="status">
                    <FiberManualRecordIcon
                      style={{
                        color: "#00d300",
                        fontSize: "13px",
                        marginTop:"2px",
                        marginRight: "2px",
                      }}
                    />
                    <p>{user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1)}</p>
                  </div>
                ) : (
                  <div className="status">
                    <FiberManualRecordIcon
                      style={{
                        color: "red",
                        fontSize: "13px",
                        marginTop:"2px",
                        marginRight: "2px",
                      }}
                    />
                    <p>{user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1)}</p>
                  </div>
                )
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="search_menu">
          <div>
            <SearchIcon
              style={{ marginTop: "5px", marginLeft: "5px", color: "#aebac1" }}
            />
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
      </div>
    </div>
  );
};

export default ChatNav;
