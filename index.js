require("dotenv").config();
const express = require("express")
const userRoute = require("./routes/userRoutes");
const connectMongoDB = require("./database/connection");

const app = express()

app.use(express.json())

//user route 
app.use("/user" , userRoute); 


//health check 
app.get("/" , (req,res) => {
        return res.send("Health Check : Server running fine")
})

// const startServer = async () => {
//     const PORT = process.env.PORT || 3000;
//     try {
//         await connectMongoDB();
//         app.listen(PORT, () => {
//             console.log(`Server is running on PORT: ${PORT}`);
//         });
//     } catch (err) {
//         console.error('Failed to start server due to DB connection error:', err);
//         process.exit(1);
//     }
// };

// startServer();

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