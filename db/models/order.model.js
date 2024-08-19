import { Schema ,Types,model} from "mongoose";

const orderSchema=new Schema({
   
     user:{
         type:Types.ObjectId,
         ref:"User"
        },
        products:[{
            title:{type:String,required:true},
            productId:{type:Types.ObjectId,ref:"Product"},
            quantity:{type:Number,required:true},
            price:{type:Number,required:true},
            finalprice:{type:Number,required:true}
           }],
        subprice:{type:Number,required:true},
        couponId:{type:Types.ObjectId,ref:"Coupon"},
        totalprice:{type:Number,required:true},
        address:{type:String,required:true},
        phone:{type:String,required:true},
        paymentMethod:{
            type:String,
            enum:["card","cash"],
            required:true
        },
        status:{
            type:String,
            enum:["placed","waitpayment","delivered","oneWay","canceled","rejected"],
           default:"placed" 
           },
        canceledBy:{
            type:Types.ObjectId,
            ref:"User"
           },
           reason:{
            type:String
           }
        
        },
 {
     timestamps:true,
     versionkey:false
})
const orderModel=model('Order',orderSchema)

export default orderModel

