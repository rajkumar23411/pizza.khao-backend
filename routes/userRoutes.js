const { register, login, logOut } = require("../controllers/userController");

const userRoute = require("express").Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/logout", logOut);

module.exports = userRoute;
