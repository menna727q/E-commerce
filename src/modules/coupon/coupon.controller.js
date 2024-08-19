import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import couponModel from "../../../db/models/cupon.model.js";

//========================add coupon=========================
export const createCoupon=asyncHandler(async(req,res,next)=>{
    const {code,amount,fromDate,toDate}=req.body

   const couponexist= await couponModel.findOne({code:code.toLowerCase()})
   if(couponexist){
    return next(new AppError("coupon already exist",409))
   }

   const coupon = await couponModel.create({
    code,
    amount,
    fromDate,
    toDate,
    createdBy:req.user._id
   })
    return res.status(200).json({message:"Coupon added successfully",coupon})
})

//========================update coupon=========================
export const updateCoupon=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const {code,amount,fromDate,toDate}=req.body

   const coupon= await couponModel.findByIdAndUpdate(
    {_id:id, createdBy:req.user._id},
    {
    code,
    amount,
    fromDate,
    toDate},
    { new:true})
   if(!coupon){
    return next(new AppError("coupon not exist",409))
   }
    return res.status(200).json({message:"Coupon updated successfully",coupon})
})

