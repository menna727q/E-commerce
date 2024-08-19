import { Schema ,Types,model} from "mongoose";

const cartSchema=new Schema({
   
     user:{
         type:Types.ObjectId,
         ref:"User"
        },
        products:[{
            productId:{type:Types.ObjectId,ref:"Product",required:true},
            quantity:{type:Number,required:true}
           }],
     customId:String
 },
 {
     timestamps:true,
     versionkey:false
})
const cartModel=model('Cart',cartSchema)

export default cartModel

