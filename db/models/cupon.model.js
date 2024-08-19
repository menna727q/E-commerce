import { Schema ,Types,model} from "mongoose";

const couponSchema=new Schema({
    code:{
        type:String,
        required:[true,'name is required'],
        minLength:3,
        maxLength:30,
        lowercase:true,
        trim:true,
        unique:true},
     createdBy:{
         type:Types.ObjectId,
         ref:"User",
         required:true
     },
     amount:{
        type:Number,
        required:[true,'amount is required'],
        min:1,
        max:100

     },
     usedBy:[{
        type:Types.ObjectId,
        ref:"User",
    }],
    fromDate:{
        type:Date,
        required:[true,'fromDate is required'],
    },
    toDate:{
        type:Date,
        required:[true,'toDate is required'],
    }
 },
 {
     timestamps:true,
     versionkey:false
})
const couponModel=model('Coupon',couponSchema)

export default couponModel

