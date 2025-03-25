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

const linkSchema= new Schema({
    hash: {type : String , require: true},
    userId: {type : ObjectId, ref: "users",require: true}
})

export const linkModel= model("links",linkSchema);
