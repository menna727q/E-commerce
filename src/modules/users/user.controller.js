import jwt from "jsonwebtoken";
import userModel from "../../../db/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { sendEmail } from "../../service/sendEmail.js";
import bcrypt from 'bcrypt'
import { customAlphabet, nanoid } from "nanoid";

//====================================signup==========================================
export const signup= asyncHandler(async(req,res,next)=>{
    const {name,email,password,cPassword,age,address,phone}=req.body;
    const userExist = await userModel.findOne({email:email.toLowerCase()})
    userExist&&next(new AppError('User already exist',409))

    const token=jwt.sign({email},process.env.signatureToken,{expiresIn:60*2})
    const link=`${req.protocol}://${req.headers.host}/user/verifyEmail/${token}`

     const reftoken=jwt.sign({email},process.env.signatureTokenRefresh)
    const reflink=`${req.protocol}://${req.headers.host}/user/refreshToken/${reftoken}`
    await sendEmail(email, "verify your email",`<a href=${link}>click here</a> <br>
        <a href=${reflink}>click here to resend link</a>`)

    const hashpass=bcrypt.hashSync(password,10);
    const user = new userModel({
        name,
        email,
        password:hashpass,
        age,
        address,
        phone
    })
    const newUser=await user.save();

    newUser ? res.status(201).json({message:'User created successfully',user:newUser}):next(new AppError("user not created ",500))


})

//====================================verifyEmail======================================
export const verifyEmail= asyncHandler(async(req,res,next)=>{
    const {token}=req.params;
    const decode=jwt.verify(token, process.env.signatureToken)
    if(!decode?.email){
        return next(new AppError('invalid token',400))
    }
    const user = await userModel.findOneAndUpdate(
        { email: decode.email, confirmed: false }, // Find user by email and unconfirmed status
        { $set: { confirmed: true } }, // Update confirmed status to true
        { new: true } // Return the updated document
    );

    if (user) {
        return res.status(200).json({ message: 'Email verification successful' });
    } else {
        return next(new AppError('User does not exist or is already confirmed', 400));
    }
})

//====================================refreshToken======================================
export const refreshToken= asyncHandler(async(req,res,next)=>{
    const {reftoken}=req.params;
    const decode=jwt.verify(reftoken, process.env.signatureToken)
    if(!decode?.email){
        return next(new AppError('invalid token',400))
    }
    const user= await userModel.findOne({email:decode.email,confirmed:true})
    if(user){
        return next(new AppError("user already confirmed",400))
    }
    const token=jwt.sign({email:decode.email},process.env.signatureToken,{expiresIn:60*10})
    const link=`${req.protocol}://${req.headers.host}/user/verifyEmail/${token}`  
    await sendEmail(decode.email, "verify your email",`<a href=${link}>click here</a> `) 

    res.status(200).json({msg:"done"})
})

//====================================forget password======================================
export const forgetPassword= asyncHandler(async(req,res,next)=>{
    const {email}=req.body;
 
    const user= await userModel.findOne({email:email.toLowerCase()})
    if(!user){
        return next(new AppError("user not exist",400))
    }

   const code=customAlphabet("123456789",5);
   const newcode=code()
    await sendEmail(email, "reset your password",`<h1> your code is ${newcode} </h1> `) 
    await userModel.updateOne({email},{ code:newcode})

    res.status(200).json({message:"done"})
})

//====================================reset password======================================
export const resetPassword= asyncHandler(async(req,res,next)=>{
    const {email,code,password}=req.body;
 
    const user= await userModel.findOne({email:email.toLowerCase()})
    if(!user){
        return next(new AppError("user not exist",400))
    }

    if(user.code !==code || code== ""){
        return next(new AppError("code not valid",400))

    }
    const hash=bcrypt.hashSync(password,+process.env.saltRounds)

    await userModel.updateOne({email},{ password:hash,code:"",passwordChangedAt:Date.now()})

    res.status(200).json({message:"done"})
})
//===================================signin=============================================
export const signin= asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;

    const userExist = await userModel.findOne({email:email.toLowerCase(),confirmed:true})

     if(!userExist|| !bcrypt.compareSync(password,userExist.password)){
        return next(new AppError('user not exist or invalid password',404))
     }

    const token= jwt.sign({email,role:userExist.role},process.env.signatureToken)

    await userModel.updateOne({email},{isLogged:true});

    res.status(200).json({message:'done',token})


})

