require("dotenv").config();
const express = require("express")
const userRoute = require("./routes/userRoutes")
const app = express()

app.use(express.json())

//user route 
app.use("/user" , userRoute); 


//health check 
app.get("/" , (req,res) => {
    return res.send("Health Check : Server running fine")
})


app.listen(process.env.PORT , () => {
    console.log(`Server is running is running on PORT : ${process.env.PORT}`)
})