import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";

//========================add cart=========================
export const createCart=asyncHandler(async(req,res,next)=>{
    const {productId,quantity}=req.body
     
    const product= await productModel.findOne({_id:productId,stock:{ $gte:quantity}})
    if(!product){
        return next(new AppError("product not exist or out of stock",409))

    }
     
    const cartexist=await cartModel.findOne({user:req.user._id})

    if(!cartexist){
        const cart= await cartModel.create({
            user:req.user._id,
            products:[{
                productId,
                quantity
            }]
        })
        return res.status(200).json({message:"added to Cart successfully",cart})
    }

    let flag=false
    for(let product of cartexist.products){
        if(productId==product.productId){
            product.quantity=quantity
            flag=true
        }
    }
    if(!flag){
        cartexist.products.push({
            productId,
            quantity
        })
    }
    await cartexist.save()
    return res.status(200).json({message:"Done",cart:cartexist})
})

//========================remove cart=========================
export const removeCart=asyncHandler(async(req,res,next)=>{
    const {productId}=req.body
    
    const cartexist=await cartModel.findOneAndUpdate(
        {user:req.user._id,
            "products.productId":productId
        },
        {
            $pull: {products:{productId}}
        },
        {new:true}
    )

  
    return res.status(200).json({message:"Done",cart:cartexist})
})

//========================clear cart=========================
export const clearCart=asyncHandler(async(req,res,next)=>{
    
    const cartexist=await cartModel.findOneAndUpdate(
        {user:req.user._id,
        },
        {
          products:[] 
       },
        {new:true}
    )

  
    return res.status(200).json({message:"Done",cart:cartexist})
})
