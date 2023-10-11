const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "UnAuthorized user " });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { _id } = await jwt.verify(token, JWT_SECRET);
    const user = { _id };
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "UnAuthorized use " });
  }
};

module.exports = auth;
