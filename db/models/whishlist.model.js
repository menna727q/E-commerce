import { Schema ,Types,model} from "mongoose";

const wishlistSchema=new Schema({
   
     user:{
         type:Types.ObjectId,
         ref:"User",
         required:true
     },
     products:[{
        type:Types.ObjectId,
        ref:"Product",
        required:true
    }]
    
 },
 {
     timestamps:true,
     versionkey:false
})
const wishlistModel=model('WishList',wishlistSchema)

export default wishlistModel

