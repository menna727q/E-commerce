import {Schema,model} from 'mongoose';
import { systemRoles } from '../../src/utils/systemRoles.js';

const userSchema=new Schema({
    name:{
       type:String,
       required:[true,'name is required'],
       minLength:3,
       maxLength:15,
       trim:true},
    email:{
        type:String,
        required:[true,'email is required'],
       unique:true,
       lowercase:true,
        trim:true},
    password:{
        type:String,
        required:[true,'password is required'],
        trim:true},
    age:{
        type:String,
        required:[true,'password is required'],
        },
    phone:[String],
    address:[String],
    confirmed:{
        type:Boolean,
        default:false
    },
    isLogged:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(systemRoles),
        default:systemRoles.user
    },
    passwordChangedAt:Date,
    code:String

},
{
    timestamps:true,
    versionkey:false
})

const userModel= model('User',userSchema)
export default userModel