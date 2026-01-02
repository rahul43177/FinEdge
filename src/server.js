require("dotenv").config();
const app = require("./app");
const connectMongoDB = require("./database/connection");
const logger = require("./middleware/logger");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, "::", () => {
      logger.info(`The server is running on PORT : ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
