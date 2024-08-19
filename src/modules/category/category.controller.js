import { nanoid } from "nanoid";
import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from '../../utils/cloudinary.js'
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";

//========================add category=========================
export const addCat=asyncHandler(async(req,res,next)=>{
    const {name}=req.body

    const category=await categoryModel.findOne({name:name.toLowerCase()})
    if(category){
        return next(new AppError("Category already exist",409))
    }
    if(!req.file){
        return next(new AppError("image is required ",404))
    }

    const customId=nanoid(5)
    const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`EcommerceC42/categories/${customId}`
    })
    req.filepath=`EcommerceC42/categories/${customId}`
    const newcat = await categoryModel.create({
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
    req.data={
        model:categoryModel,
        id:category._id
    }
    return res.status(200).json({message:"Category added successfully",newcat})
})

//========================update category=========================
export const updatecat=asyncHandler(async(req,res,next)=>{
    const {name}=req.body
    const {id}=req.params
    const category=await categoryModel.findById({_id:id, createdBy:req.user._id})
    if(!category){
        return next(new AppError("Category not exist",404))
    }
    if(name){
        if(name.toLowerCase()==category.name){
            return next(new AppError("name must be different ",409))

        }
        if(await categoryModel.findOne({name:name.toLowerCase()})){
            return next(new AppError("name already exist",404))

        }
        category.name= name.toLowerCase()
        category.slug=slugify(name,{  
              replacement:"_",
              lower:true
})
    }
    if(req.file){
    await cloudinary.uploader.destroy(category.image.public_id)
    const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`EcommerceC42/categories/${category.customId}`
    })
    category.image={secure_url,public_id}
    }

    await category.save()
    return res.status(200).json({message:"Category updated successfully",category})
})
//==============================getcategory====================================
export const getcategories=asyncHandler(async(req,res,next)=>{

    const categoryexist=await categoryModel.find({}).populate([
        {path:"subcategories"}
    ])
   
    
    return res.status(200).json({message:"subCategory added successfully",categoryexist})
})
//==============================deletecategory====================================
export const deletecategory=asyncHandler(async(req,res,next)=>{

   const {id}=req.params

   const category=await categoryModel.findByIdAndDelete({_id:id,createdBy:req.user._id})
    if(!category){
        return next(new AppError("category not exist or you don't have permission",404))
    }

    await subCategoryModel.deleteMany({category:category._id})
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`EcommerceC42/categories/${category.customId}`)
    return res.status(200).json({message:"Category deleted successfully"})
})