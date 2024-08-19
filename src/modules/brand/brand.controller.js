import { nanoid } from "nanoid";
import brandModel from "../../../db/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from '../../utils/cloudinary.js'
import slugify from "slugify";

//========================add brand=========================
export const createBrand=asyncHandler(async(req,res,next)=>{
    const {name}=req.body

    const brand=await brandModel.findOne({name:name.toLowerCase()})
    if(brand){
        return next(new AppError("Category already exist",409))
    }
    if(!req.file){
        return next(new AppError("image is required ",404))
    }

    const customId=nanoid(5)
    const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`EcommerceC42/Brands/${customId}`
    })
    const newbrand = await brandModel.create({
        name,
        slug: slugify(name, {
            replacement: "_",
            lower: true
        }),
        customId,
        createdBy: req.user._id,
        image:{
            secure_url,
            public_id
        }

    });
    return res.status(200).json({message:"Brand added successfully",newbrand})
})

