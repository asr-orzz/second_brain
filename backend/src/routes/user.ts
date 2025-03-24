import {Router} from "express"
export const userRouter=Router();
import {z} from "zod";
import { userModel } from "../db";
import bcrypt from "bcrypt"

userRouter.post('/signup',async function (req,res){
    const requiredBodySchema=z.object({
        username: z.string(),
        password: z.string().min(8,{message:"min should be 8 letters"}).regex(/[A-Z]/).regex(/[a-z]/).regex(/[\W_]/)
    })
    const verify=requiredBodySchema.safeParse(req.body);
    if(verify.success){
        const hashedPass=await bcrypt.hash(req.body.password,5);
        try{
            await userModel.create({  
                username: req.body.username,
                password: hashedPass
            })
            res.status(200).json({
                msg : "User is Signed Up"
            })
        }
        catch(e){
            res.status(403).json({
                msg : "User already Exists of Same Username"
            })
        }
        
    }
    else{
        res.status(411).json({
            msg : verify.error
        })
    }
})

