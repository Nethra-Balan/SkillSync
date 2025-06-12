const router = require("express").Router();
const { loginUser,signupUser } = require("../controllers/authController");

router.post("/signup", signupUser);
router.post("/login", loginUser);

module.exports = router;
