import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app=express();
app.use(express.json());

async function main(){
    const mongooseUrl = process.env.MONGOOSE_URL;
    if (!mongooseUrl) {
        throw new Error("MONGOOSE_URL is not defined in the environment variables");
    }
    await mongoose.connect(mongooseUrl);
    app.listen(process.env.PORT,()=>{
        console.log("Backend is listening on port "+ process.env.PORT);
    });
}

main();