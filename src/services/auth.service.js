const users = require("../database/users.db");
const jwt = require("jsonwebtoken");

const loginService = (email, password) => {
  if(!email || !password) {
    throw new Error("EMPTY_DATA")
  }

  const foundUser = users.find((user) => email === user.email);

  if(!foundUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if(foundUser.password !== password) {
    throw new Error("INVALID_PASSWORD");
  }

  const payload = {
    userId: foundUser.id,
    role: foundUser.role
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  return token;

}

module.exports = {
  loginService
}