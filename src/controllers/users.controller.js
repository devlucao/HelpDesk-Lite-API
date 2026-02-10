const { createUserService } = require("../services/users.service");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await createUserService(name, email, password);

    return res.status(201).json(newUser)
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser }
