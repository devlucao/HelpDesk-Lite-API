require("dotenv").config();
const express = require("express");
const { authRouter } = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use(authRouter);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000.")
});
