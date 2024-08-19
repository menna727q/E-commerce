import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from "../../../db/models/product.model.js";
import reviewModel from "../../../db/models/review.model.js";
import orderModel from "../../../db/models/order.model.js";

//========================add review=========================
export const createReview=asyncHandler(async(req,res,next)=>{
    const {comment,rate}=req.body
    const {productId}=req.params
    const product=await productModel.findById(productId)
   if(!product){
    return next(new AppError("product not found",404))
   }
   const reviewexist= await reviewModel.findOne({createdBy:req.user._id,productId})
   if(reviewexist){
    return next(new AppError("already reviewd",400))
   }
   const order=await orderModel.findOne({
    user:req.user._id,
    "products.productId":productId,
    status:"delivered"
   })
   if(order){
    return next(new AppError("order not found",404))
   }
   const review = await reviewModel.create({
    comment,
    rate,
    productId,
    createdBy:req.user._id
   })

let sum= product.ratingAvg * product.ratingNum
sum = sum + rate
product.ratingAvg = sum / (product.ratingNum +1) 
product.ratingNum += 1
   await product.save()
    return res.status(200).json({message:"review added successfully",review})
})
//========================delete review=========================
export const deleteReview=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const review= await reviewModel.findOneAndDelete(
        {_id:id,createdBy:req.user._id,})

    if(!review){
     return next(new AppError("not exist ",404))
    }

    const product=await productModel.findById(review.productId)


let sum= product.ratingAvg * product.ratingNum
sum = sum - review.rate
product.ratingAvg = sum / (product.ratingNum - 1) 
product.ratingNum -= 1
   await product.save()
    return res.status(200).json({message:"review deleted successfully",review})
})



