import {Schema,Types,model} from 'mongoose';
const categorySchema=new Schema({
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
    customId:String
},
{
    timestamps:true,
    versionkey:false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
categorySchema.virtual("subcategories",{
    ref:"subCategory",
    localField:"_id",
    foreignField:"category"
})
const categoryModel= model('Category',categorySchema)
export default categoryModel