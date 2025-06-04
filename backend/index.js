const express=require("express");
const cors=require("cors");
const taskRoute=require("./routes/taskRoute")
const userRoute=require("./routes/userRoute")
require("dotenv").config();

const app=express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use("/api/tasks",taskRoute);
app.use("/api/users",userRoute)

const PORT= process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})