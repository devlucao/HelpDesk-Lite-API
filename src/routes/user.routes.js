const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const { getMe } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/me", validateToken, getMe);

module.exports = { userRouter };