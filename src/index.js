require("dotenv").config();
const express = require("express")
const userRoute = require("./routes/userRoutes");
const transactionRoute = require("./routes/transactionRoutes"); 
const connectMongoDB = require("./database/connection");
const errorHandler = require("./middleware/errorHandler");

const app = express()

app.use(express.json())
//user route 
app.use("/users" , userRoute); 
//transaction route 
app.use("/transactions" ,  transactionRoute)

//error global middleware 
app.use(errorHandler); 
//health check 
app.get("/" , (req,res) => {
        return res.send("Health Check : Server running fine")
})

const startServer = async () => {
    try {
        await connectMongoDB(); 
        app.listen(process.env.PORT , () => {
            console.log(`The server is running on PORT : ${process.env.PORT}`)
        })
    } catch(error) {
        console.log("Failed to start server to DB connection error:",err);
        process.exit(1); 
    }
}


startServer()