import { Schema ,Types,model} from "mongoose";

const reviewSchema=new Schema({
    comment:{
        type:String,
        required:[true,'name is required'],
        minLength:3,
        trim:true},
     createdBy:{
         type:Types.ObjectId,
         ref:"User",
         required:true
     },
     rate:{
        type:Number,
        required:[true,'rate is required'],
        min:1,
        max:100

     },
     productId:{
        type:Types.ObjectId,
        ref:"Product",
        required:true
    },
   
 },
 {
     timestamps:true,
     versionkey:false
})
const reviewModel=model('Review',reviewSchema)

export default reviewModel

