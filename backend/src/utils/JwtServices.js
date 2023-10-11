const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const generateToken = (data) => {
  return jwt.sign(
    {
      data,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};


module.exports= {generateToken}