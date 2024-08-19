import {Schema,Types,model} from 'mongoose';
const subCategorySchema=new Schema({
    name:{
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
        maxLength:30,
        trim:true,
        unique:true},
     image:{
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
    customId:String
},
{
    timestamps:true,
    versionkey:false
})
const subCategoryModel= model('subCategory',subCategorySchema)
export default subCategoryModel