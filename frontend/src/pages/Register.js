import React, { useState } from "react";
import { Card, Grid } from "@mui/material";
import registerWalpaper from "../assets/img/loginImg.jpg";
import { cardLogin } from "../assets/jss/CardStyle";
import CustomInput from "../component/CustomInput";
import RegularButton from "../component/RegularButton";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/Api";
import { errorMsg, successMsg } from "../controller/ToastController";

const Register = () => {
  const history = useNavigate();
  const [field, setField] = useState({ name: "", phone: "", password: "" });
  const handleChange = (e) => {
    const target = e.target;
    setField({ ...field, [target.id]: target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post("/user/register", field).then(res=>res.data);
      await successMsg(response.message)
      setTimeout(() => {
        history("/login");
      }, 300);
    } catch (error) {
      const message = error.response
        ? error.response?.data?.message
        : error.message;
        errorMsg(message)
     
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${registerWalpaper})`,
      }}
    >
      <div
        style={{ display: "grid", placeItems: "center", alignItems: "center" }}
      >
        <Card style={cardLogin}>
          <h1 style={{margin:"10px 0px"}}>Register</h1>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} md={8}>
              <CustomInput
                labelText="Name"
                id="name"
                formControlProps={{
                  fullWidth: true,
                }}
                handleChange={handleChange}
                type="text"
              />
            </Grid>
            <Grid item xs={6} md={8}>
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
            <Grid item xs={6} md={8}>
              <CustomInput
                labelText="Password"
                id="password"
                formControlProps={{
                  fullWidth: true,
                }}
                handleChange={handleChange}
                type="text"
              />
            </Grid>
            <Grid item xs={6} md={8}>
              <RegularButton
                type="button"
                color="primary"
                className="form__custom-button"
                onClick={handleSubmit}
              >
                Register
              </RegularButton>
            </Grid>
            <Grid item xs={6} md={8} mb={5}>
              <Link to="/login">
                <p>Already have an account? Sign in</p>
              </Link>
            </Grid>
          </Grid>
        </Card>
      </div>
    </div>
  );
};

export default Register;
