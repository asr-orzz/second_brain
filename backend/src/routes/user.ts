import {Router} from "express"
export const userRouter=Router();
import jwt from "jsonwebtoken";
import {z} from "zod";
import { contentModel, linkModel, userModel } from "../db";
import bcrypt from "bcrypt"
import { userMiddleware } from "../middlewares/userMiddleware";
import { random } from "../utils";

const bodySchema=z.object({
    username: z.string(),
    password: z.string().min(8,{message:"min should be 8 letters"}).regex(/[A-Z]/).regex(/[a-z]/).regex(/[\W_]/)
})

userRouter.post('/signup',async function (req,res){
   
    const verify=bodySchema.safeParse(req.body);
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

userRouter.post('/signin',async (req,res)=>{
    
    
    const verify=bodySchema.safeParse(req.body);

    if(verify.success){
        const username=req.body.username;
        const password=req.body.password;
        const user=await userModel.findOne({
            username: username
        })
        
        if(user){
            try{
                const verify= await bcrypt.compare(password,user.password!);
                if(verify){
                    const jwtToken=jwt.sign({
                        userId : user._id
                    },process.env.USER_JWT_SECRET!);
                    res.json({
                        token: jwtToken
                    })
                }
            }
            catch(e){
                res.status(403).json({
                    msg: "Enter valid Credentials"
                })
            }    
        }
        else{
            res.json({
                msg:"User Doesn't Exist"
            })
        }
    
}   
    else{
        res.status(411).json({
            msg: "Enter Valid Username and Password"
        })
    }
})



userRouter.post("/content",userMiddleware,async (req,res)=>{
    const reqContentSchema=z.object({
        type : z.string(),
        link : z.string(),
        title : z.string()
    })
    const verify=reqContentSchema.safeParse(req.body);
    if(verify.success){
        await contentModel.create({
            type: req.body.type,
            link: req.body.link,
            title: req.body.title,
            tags: [],
            userId: req.body.userId
        })
        res.json({
            msg:"Content Added"
        })
    }
})

userRouter.get("/content",userMiddleware,async (req,res)=>{
    const userId=req.body.userId;
    const Contents= await contentModel.find({
        userId: userId
    }).populate("userId","username")

    res.json({
        Contents
    })
})


userRouter.put("/content",userMiddleware,async (req,res)=>{
    const contentId=req.body.contentId;

    await contentModel.deleteOne({
        _id: contentId
    })
    res.json({
        msg:"Content Deleted"
    })
})


userRouter.post("/brain/share",userMiddleware,async (req,res)=>{
    const share=req.body.share;

    if(share){
        const exisitingLink= await linkModel.findOne({
            userId: req.body.userId
        })
        if(exisitingLink){
            res.json({
                hash: exisitingLink.hash
            })
            return 
        }
        const hash=random(15);
        await linkModel.create({
            hash: hash,
            userId: req.body.userId
        })
        res.json({
            hash: hash
        })
    } 
    else{
        await linkModel.deleteOne({
            userId: req.body.userId
        })
        res.json({
            msg: "Sharing Brain Disabled"
        })
    }  
})

userRouter.get("/brain/:shareLink",async (req,res)=>{
    const shareLink=req.params.shareLink;
    const link= await linkModel.findOne({
        hash: shareLink
    })

    if(link){
        const content= await contentModel.find({
            userId: link.userId
        })
        const user=await userModel.findOne({
            _id: link.userId
        })
        if(user){
            res.json({
                username: user.username,
                content: content
            })
        }
    }
    else{
        res.json({
            msg:"Invalid Link"
        })
    }
})