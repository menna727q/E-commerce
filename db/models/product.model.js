import { Schema, model, Types } from "mongoose";

const productSchema=new Schema({
    title:{
        type:String,
        required:[true,'name is required'],
        minLength:3,
        maxLength:30,
        lowercase:true,
        trim:true,
        unique:true},
     slug:{
         type:String,
         required:[true,'slug is required'],
         minLength:3,
         maxLength:60,
         trim:true,
         unique:true},
     description:{
            type:String,
            required:[true,'description is required'],
            minLength:3,
            trim:true},
      image:{
         secure_url: String,
         public_id: String
     },
     coverimage:{
        secure_url: String,
        public_id: String
    },
     createdBy:{
         type:Types.ObjectId,
         ref:"User",
         required:true
     },
     category:{
        type:Types.ObjectId,
        ref:"Category",
        required:true
    },
    subcategory:{
        type:Types.ObjectId,
        ref:"subCategory",
        required:true
    },
    brand:{
        type:Types.ObjectId,
        ref:"Brand",
        required:true
    },
     customId:String,
     price:{
      type:Number,
      require:true,
      min:1
     },
     discount:{
        type:Number,
        default:1,
        min:1,
        max:100
     },
     subprice:{
        type:Number,
        default:1
     },
     stock:{
        type:Number,
        default:1
     },
     ratingAvg:{
        type:Number,
        default:0
     },
     ratingNum:{
        type:Number,
        default:0
     },
   

 },
 {
     timestamps:true,
     versionkey:false,
   
 })
//  categorySchema.virtual("subcategories",{
//      ref:"subCategory",
//      localField:"_id",
//      foreignField:"category"
//  })
 const productModel= model('Product',productSchema)
 export default productModel