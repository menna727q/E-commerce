import { nanoid } from "nanoid";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from '../../utils/cloudinary.js'
import slugify from "slugify";
import categoryModel from "../../../db/models/category.model.js";

//========================add category=========================
export const addsubCat=asyncHandler(async(req,res,next)=>{
    const {name}=req.body
    console.log(req.params)

    const categoryexist=await categoryModel.findById(req.params.categoryId)
    if(!categoryexist){
        return next(new AppError("Category not exist",409))
    }
    const subCategoryexist=await subCategoryModel.findOne({name:name.toLowerCase()})
    if(subCategoryexist){
        return next(new AppError("Subcategry already exist",409))
    }
    if(!req.file){
        return next(new AppError("image is required ",404))
    }

    const customId=nanoid(5)
    const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`EcommerceC42/categories/${categoryexist.customId}/subcategories/${customId}`
    })
    const newcat = await subCategoryModel.create({
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
        },
        category:req.params.categoryId

    });
    return res.status(200).json({message:"subCategory added successfully",newcat})
})
//========================update subcategory=========================
export const updatesubcat=asyncHandler(async(req,res,next)=>{
    const {name,category}=req.body
    const {id}=req.params
    const categoryexist=await categoryModel.findById(category)
    if(!categoryexist){
        return next(new AppError("Category not exist",409))
    }
    const subcategory=await subCategoryModel.findById({_id:id, createdBy:req.user._id})
    if(!subcategory){
        return next(new AppError("Subcategory not exist",404))
    }
    if(name){
        if(name.toLowerCase()==subcategory.name){
            return next(new AppError("name must be different ",409))

        }
        if(await subCategoryModel.findOne({name:name.toLowerCase()})){
            return next(new AppError("name already exist",404))

        }
        subcategory.name= name.toLowerCase()
        subcategory.slug=slugify(name,{  
              replacement:"_",
              lower:true
})
    }
    if(req.file){
    await cloudinary.uploader.destroy(subcategory.image.public_id)
    const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`EcommerceC42/categories/${categoryexist.customId}/subcategories/${subcategory.customId}`
    })
    subcategory.image={secure_url,public_id}
    }

    await subcategory.save()
    return res.status(200).json({message:"Subcategory updated successfully",subcategory})
})
//==============================getSubcategory====================================
export const getSubcategory=asyncHandler(async(req,res,next)=>{

    const subcategoryexist=await subCategoryModel.find({}).populate([{
        path:"category"},
        {
            path:"createdBy"
        }
    ])
    
    return res.status(200).json({message:"subCategory added successfully",subcategoryexist})
})