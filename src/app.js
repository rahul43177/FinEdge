require("dotenv").config();
const express = require("express");

const userRoute = require("./routes/userRoutes");
const transactionRoute = require("./routes/transactionRoutes");
const summaryRoute = require("./routes/summaryRoutes");

const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const rateLimiter = require("./middleware/rateLimiter");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/users", userRoute);
app.use("/transactions", transactionRoute);
app.use("/summary", summaryRoute);

app.get("/health", (req, res) => {
  res.send("Health Check : Server running fine");
});

app.use(errorHandler);

module.exports = app;
