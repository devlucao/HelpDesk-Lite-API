const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const { getMe, isAdmin, createUser } = require("../controllers/user.controller");
const { validateRole } = require("../middlewares/requireRole.middleware");

const userRouter = express.Router();

userRouter.get("/me", validateToken, getMe);
userRouter.get("/admin/ping", validateToken, validateRole, isAdmin);

userRouter.post("/users", createUser);

module.exports = { userRouter };