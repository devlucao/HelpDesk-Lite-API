const { authService } = require("../services/auth.service");

const login = (req, res) => {
  try{
  const { email, password } = req.body;

    const validateLogin = authService(email, password);

    return res.status(200).json({token: validateLogin});

  } catch(error) {
    if(error.message === "EMPTY_DATA") {
      return res.status(400).json({ error: "Campo e-mail e senha são obrigatórios." });
    }
    if(error.message === "USER_NOT_FOUND") {
      return res.status(401).json({ error: "Usuário não existe, favor verificar. "});
    }
    if(error.message === "INVALID_PASSWORD") {
      return res.status(401).json({ error: "Senha incorreta. Tente novamente." });
    }
    return res.status(500).json({error: error.message});
  }
}

module.exports = {
  login
}