const { createUserService } = require("../services/users.service");
const { created } = require("../utils/httpResponse");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await createUserService(name, email, password);

    return created(res, newUser);
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser }
