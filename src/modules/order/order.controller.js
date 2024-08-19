import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import couponModel from "../../../db/models/cupon.model.js";
import orderModel from "../../../db/models/order.model.js";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from "../../service/sendEmail.js";

//========================add order=========================
export const createOreder=asyncHandler(async(req,res,next)=>{
    const {productId,quantity,couponcode,address,phone,paymentMethod}=req.body
     
    const coupon=await couponModel.findOne(
        {code:couponcode.toLowerCase(),
        usedBy:{$nin:[req.user._id]}

        }
    )
    if(!coupon || coupon.toDate<Date.now()){
        return next(new AppError("coupon not exist or expired",404))
    }
    req.body.coupon=coupon

    let products=[]
    let flag=false
    if(productId){
        products=[{productId,quantity}]
    }else{
        const cart= await cartModel.findOne({user:req.user._id})
        if(!cart.products.length){
            return next(new AppError("cart is  empty ",404))

        }
        products=cart.products
        flag=true
    }
    let finalProducts=[]
    let subprice=0
    for(let product of products){
        const checkproduct= await productModel.findOne({_id:product.productId,stock:{ $gte:product.quantity}})
        if(!checkproduct){
            return next(new AppError("product not exist or out of stock",404))
    
        }
        if(flag){
            product=product.toObject()
        }
        product.title= checkproduct.title
        product.price=checkproduct.price
        product.finalprice=checkproduct.subprice*product.quantity
        subprice+=product.finalprice
        finalProducts.push(product)
    }
     const order = await orderModel.create({
        user:req.user._id,
        products:finalProducts,
        subprice,
        couponId:req.body?.coupon?._id,
        totalprice: subprice - subprice*(( req.body.coupon?.amount||0 )/100),
        paymentMethod,
        status:paymentMethod=="cash"?"placed":"waitpayment",
        phone,
        address
     })
     if(req.body?.coupon){
         await couponModel.updateOne({_id:req.body.coupon._id},{
            $push:{usedBy:req.user._id}
         })
     }
     for(let product of finalProducts){
        await productModel.findByIdAndUpdate({_id:product.productId},{
            $inc:{stock: -product.quantity}
        })
     }

     if(flag){
        await cartModel.updateOne({user:req.user._id},{products:[]})
     }
     const invoice = {
        shipping: {
          name: req.user.name,
          address: req.user.address,
          city: "San Francisco",
          state: "CA",
          country: "US",
          postal_code: 94111
        },
        items: order.products,
        subtotal: subprice,
        paid: order.totalprice,
        invoice_nr: order._id,
        date:order.createdAt,
        coupon:req.body?.coupon?.amount
      };
     await createInvoice(invoice, "invoice.pdf")
     await sendEmail(req.user.email,"Order placed",`Your order has been placed successfully`,
        [
            {
                path:"invoice.pdf",
                contentType:"application/pdf"
            }
        ])
     res.status(200).json({message:"Order done",order})
})
//========================cancel order======================
export const cancelOrder=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const {reason}=req.body
    const order=await orderModel.findOne({_id:id,user:req.user._id})
    if(!order){
        return next(new AppError("order not found",404))
    }
    if((order.paymentMethod=="cash"&&order.status!="placed")||(order.paymentMethod=="card"&&order.status!="waitpayment")){
        return next(new AppError("you can't cancel order",400))
    }
    await orderModel.updateOne({_id:id},{
        status:"canceled",
        canceledBy:req.user._id,
        reason
    })
    if(order?.couponId){
        await couponModel.updateOne({_id:order?.couponId},{
            $pull:{usedBy:req.user._id}
        })
    }
    for(const product of order.products){
        await productModel.updateOne({_id:product.productId},{
            $inc:{stock: -product.quantity}
        })
    }
    res.status(200).json({message:"done"})
})


