require("dotenv").config();
const express = require("express")
const userRoute = require("./routes/userRoutes");
const transactionRoute = require("./routes/transactionRoutes"); 
const connectMongoDB = require("./database/connection");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const requestLogger = require("./middleware/requestLogger");

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
//user route 
app.use("/users" , userRoute); 
//transaction route 
app.use("/transactions" ,  transactionRoute);

//error global middleware 
app.use(errorHandler);

//health check 
app.get("/health" , (req,res) => {
        return res.send("Health Check : Server running fine")
})

const startServer = async () => {
    try {
        await connectMongoDB(); 
        app.listen(port,"::", () => {
            logger.info(`The server is running on PORT : ${port}`)
        })
    } catch(error) {
        logger.info("Failed to start server to DB connection error:",error);
        process.exit(1); 
    }
}


startServer()