const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const { getMe, isAdmin } = require("../controllers/user.controller");
const { validateRole } = require("../middlewares/requireRole.middleware");

const userRouter = express.Router();

userRouter.get("/me", validateToken, getMe);
userRouter.get("/admin/ping", validateToken, validateRole, isAdmin);

module.exports = { userRouter };