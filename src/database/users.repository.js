const users = require("../database/users.db");

const findUserByEmail = (email) => users.find((user) => user.email === email);

const findUserById = (id) => users.find((user) => user.id === id);

const countByRole = (role) => users.filter((user) => user.role === role).length;

const create = (userModel) => {
  users.push(userModel);

  return userModel; 
}

module.exports = { findUserByEmail, findUserById, countByRole, create };
