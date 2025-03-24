import { model,Schema } from "mongoose";    


const userSchema=new Schema({
    username: {type: String , unique: true},
    password : String
})

export const userModel = model("user",userSchema);

