import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import dummyUser from "../../assets/img/dummyUser.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { getSocketChatData } from "../../controller/cookiesController";
import { errorMsg, successMsg } from "../../controller/ToastController";
import API from "../../utils/Api";
import { getSingleUser } from "../../utils/APICall";
import _debounce from "lodash/debounce";

const UpdateUser = ({ editOff }) => {
  const fileInputRef = useRef();
  const [user, setUser] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [aboutValue, setAboutValue] = useState("");

  let logedInUser = getSocketChatData()
    ? JSON.parse(getSocketChatData())
    : null;

  useEffect(() => {
    getSingleUser(logedInUser?._id, setUser);
  }, []);

  const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);

  async function handleDebounceFn(name, inputValue) {
    let formData = new FormData();
    formData.append([name], inputValue);
    try {
      const response = await API.put(
        `/user/update/${logedInUser?._id}`,
        formData
      ).then((res) => res.data);

      await successMsg(response.message);
      getSingleUser(logedInUser?._id, setUser);
    } catch (error) {
      const message = error.response
        ? error.response?.data?.message
        : error.message;
      errorMsg(message);
    }
  }

  function handleChange(event) {
    setNameValue(event.target.value);
    debounceFn("name", event.target.value);
  }
  function updateAbout(event) {
    setAboutValue(event.target.value);
    debounceFn("about", event.target.value);
  }

  const uploadImage = async (event) => {
    const target = event.target;
    // do something with event data
    let formData = new FormData();
    formData.append("image", target.files[0]);
    try {
      const response = await API.put(
        `/user/update/${logedInUser?._id}`,
        formData
      ).then((res) => res.data);

      await successMsg(response.message);
      getSingleUser(logedInUser?._id, setUser);
    } catch (error) {
      const message = error.response
        ? error.response?.data?.message
        : error.message;
      errorMsg(message);
    }
  };

  console.log("user :", user);
  return (
    <div className="container">
      <div className="edit_header">
        <div className="arrow_header">
          <ArrowBackIcon
            style={{
              marginRight: "5px",
              color: "#d9dee0",
              cursor: "pointer",
            }}
            onClick={editOff}
          />
          <p>Profile</p>
        </div>
      </div>
      <div className="update_field_sec">
        <div>
          <div className="img_div">
            <img
              src={
                user && user.image
                  ? "http://localhost:4001/" + user?.image
                  : dummyUser
              }
              alt=""
              className="img_edit"
            />
            <input
              onChange={uploadImage}
              accept="image/*"
              multiple={false}
              ref={fileInputRef}
              type="file"
              hidden
            />
            <div
              className={`change_photo  hide`}
              onClick={() => fileInputRef.current.click()}
            >
              <div style={{ textAlign: "center" }}>
                <AddAPhotoIcon
                  style={{
                    color: "#d9dee0",
                  }}
                />

                <p>CHANGE PROFILE PHOTO</p>
              </div>
            </div>
          </div>
        </div>
        <div className="detail_div">
          <div className="name_div">
            <p>Your Name</p>
            <input
              className="search_input"
              defaultValue={nameValue ? nameValue : user?.name}
              placeholder="Your Name"
              onChange={handleChange}
              />
          </div>
          <div className="about_div">
            <p>About</p>
            <input
              className="search_input"
              defaultValue={aboutValue ? aboutValue : user?.about}
              placeholder="About yourself"
              onChange={updateAbout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
