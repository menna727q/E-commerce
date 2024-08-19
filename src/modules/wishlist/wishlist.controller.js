import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from "../../../db/models/product.model.js";
import wishlistModel from "../../../db/models/whishlist.model.js";

//========================add wishlist=========================
export const createWishlist=asyncHandler(async(req,res,next)=>{

 const {productId}=req.params
 const product =await productModel.findById({_id: productId})

 if(!product){
    return next(new AppError("product not found",404))
 }
 const wishList= await wishlistModel.findOne({user:req.user._id})

 if(!wishList){
   const newWish= await wishlistModel.create({
    user:req.user._id,
    products:[productId]
   })
   return res.status(200).json({message:"done",wishList:newWish})
 }
    const newWish=await wishlistModel.findOneAndUpdate({
        user:req.user._id
    },{
        $addToSet:{products:productId}
    },{
        new:true
    })
  res.status(200).json({message:"done",newWish})
})




