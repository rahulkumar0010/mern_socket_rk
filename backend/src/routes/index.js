const { clearChat } = require("../controllers/chatController");
const {
  register,
  login,
  updateUser,
  getSingleUser,
  updateUserStatus,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.put("/user/update/:id", updateUser);
router.get("/user/getById/:id", getSingleUser);
router.post("/user/updateStatus/:id", updateUserStatus);

router.get("/chat/clear/:id", auth, clearChat);

// router.post("/user/add-to-chat", addUserToChat);

module.exports = router;
