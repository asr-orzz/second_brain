import { model,Schema} from "mongoose";    
const ObjectId=Schema.ObjectId;

const userSchema=new Schema({
    username: {type: String , unique: true},
    password : String
})

export const userModel = model("users",userSchema);

const contentSchema=new Schema({
    type : String,
    link : String,
    title : String,
    tags: [{type: ObjectId , ref: "tags"}],
    userId: {type: ObjectId, ref: "users"}
})

export const contentModel= model("contents",contentSchema);

