const express = require("express");
const bodyParser = require("body-parser")
const app =express();
const port =3000;
const db = require("./config/db")
require("dotenv").config();

app.use(bodyParser.json());

const cors =require("cors");
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.get("/", (req,res)=>{
    res.send("Hello World");
})

//routes
const authRoutes =require("./routes/authRoutes");

app.use("/api/auth",authRoutes);




app.listen(port,()=>{
    console.log(`Server running in port ${port}`)
})