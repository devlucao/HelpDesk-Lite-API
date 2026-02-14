require("dotenv").config();
const express = require("express");
const { authRouter } = require("./routes/auth.routes");
const { userRouter } = require("./routes/user.routes");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const { ticketRouter } = require("./routes/ticket.routes");

const app = express();

app.use(express.json());

app.use(authRouter);
app.use(userRouter);
app.use(ticketRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000.")
});
