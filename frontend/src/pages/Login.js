import React, { useContext, useState } from "react";
import { Card, Grid } from "@mui/material";

import { cardLogin } from "../assets/jss/CardStyle";
import CustomInput from "../component/CustomInput";
import RegularButton from "../component/RegularButton";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/Api";
import {
  setAccessToken,
  setSocketChatData,
} from "../controller/cookiesController";
import { errorMsg, successMsg } from "../controller/ToastController";
import { container } from "../assets/jss/loginStyle";
import { updateUserStatus } from "../utils/APICall";
import { UserContext } from "../config/context";

const Login = () => {
  const history = useNavigate();
  const { dispatch } = useContext(UserContext);
  const [field, setField] = useState({ phone: "", password: "" });
  const handleChange = (e) => {
    const target = e.target;
    setField({ ...field, [target.id]: target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post("/user/login", field).then(
        (res) => res.data
      );
      await setAccessToken(response.accessToken);
      await setSocketChatData(response.user);
      dispatch({
        type: "LOGIN",
        payload: { user: response.user, token: response.accessToken },
      });

      await successMsg(response.message);

      await updateUserStatus(response?.user?._id, { status: "online" });
      // Redirect to home after 800 mili second
      setTimeout(() => {
        history("/");
      }, 800);
    } catch (error) {
      const message = error.response
        ? error.response?.data?.message
        : error.message;
      errorMsg(message);
    }
  };

  return (
    <div style={container}>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Card style={cardLogin}>
          <h1 style={{ margin: "10px 0px" }}>Login</h1>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={8} md={8}>
              <CustomInput
                labelText="Phone"
                id="phone"
                formControlProps={{
                  fullWidth: true,
                }}
                handleChange={handleChange}
                type="text"
              />
            </Grid>
            <Grid item xs={8} md={8}>
              <CustomInput
                labelText="Password"
                id="password"
                formControlProps={{
                  fullWidth: true,
                }}
                handleChange={handleChange}
                type="password"
              />
            </Grid>
            <Grid item xs={8} md={8}>
              <RegularButton
                type="button"
                color="primary"
                className="form__custom-button"
                onClick={handleSubmit}
              >
                Log in
              </RegularButton>
            </Grid>
            <Grid item xs={6} md={8} mb={5}>
              <Link to="/register">
                <p>Don't have an account? Sign Up</p>
              </Link>
            </Grid>
          </Grid>
        </Card>
      </div>
    </div>
  );
};

export default Login;
