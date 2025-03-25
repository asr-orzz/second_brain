import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./routes/user";
dotenv.config();

const app=express();
app.use(express.json());
app.use("/api/v1/user",userRouter);

async function main(){
    const mongooseUrl = process.env.MONGOOSE_URL;
 
    await mongoose.connect(mongooseUrl!);
    app.listen(process.env.PORT,()=>{
        console.log("Backend is listening on port "+ process.env.PORT);
    });
}

main();