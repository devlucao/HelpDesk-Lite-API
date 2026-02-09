const { authService } = require("../services/auth.service");

const login = (req, res, next) => {
  try{
  const { email, password } = req.body;

    const validateLogin = authService(email, password);

    return res.status(200).json({token: validateLogin});

  } catch(error) {
    return next(error);
  }
}

module.exports = {
  login
}