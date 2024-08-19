import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from '../../utils/cloudinary.js'
import slugify from "slugify";
import productModel from "../../../db/models/product.model.js";
import categoryModel from "../../../db/models/category.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import brandModel from "../../../db/models/brand.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

//========================add product=========================
export const createproduct=asyncHandler(async(req,res,next)=>{
    const {title,description,category,subcategory,brand,price,discount,stock}=req.body
   

    const categoryexist=await categoryModel.findOne({_id:category})
    if(!categoryexist){
        return next(new AppError("Category not exist",409))
    }
    const subcategoryexist=await subCategoryModel.findOne({_id:subcategory,category})
    if(!subcategoryexist){
        return next(new AppError("subCategory not exist",409))
    }
    const brandexist=await brandModel.findOne({_id:brand})
    if(!brandexist){
        return next(new AppError("Brand already exist",409))
    }
    const productexist=await productModel.findOne({title:title.toLowerCase()})
    if(productexist){
        return next(new AppError("Product already exist",409))
    }
   const subprice= price - (price * (discount||0)/100)

   if(!req.files){
    return next(new AppError("image is required",404))
   }
   const customId=nanoid(5)
   let list=[]
   for(const file of req.files.coverimage){
       const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,
        { folder: `EcommerceC42/categories/${categoryexist.customId}/subcategories/${subcategoryexist.customId}/products/${customId}/coverImage`}
       )
       list.push({secure_url,public_id})
   }
   const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.image[0].path,
    { folder: `EcommerceC42/categories/${categoryexist.customId}/subcategories/${subcategoryexist.customId}/products/${customId}/mainImage`}
   )

   const product=await productModel.create({
    title,
    slug:slugify(title,{
        lower:true,
        replacement:"_"
    }),
    description,
    category,
    subcategory,
    brand,
    price,
    discount,
    image:{secure_url,public_id},
    coverimage:list,
    subprice,
    createdBy:req.user._id,
    stock,
    customId
   })

    return res.status(200).json({message:"product added successfully",product})
})
//==========================get products============================
export const getproducts=asyncHandler(async(req,res,next)=>{

   const apifeature= new ApiFeatures(productModel.find(),req.query).pagination()
   const products= await apifeature.mongooseQuery
    res.status(200).json({message:"done",products})
})
//========================update product=========================
export const updateproduct=asyncHandler(async(req,res,next)=>{
    const {title,description,category,subcategory,brand,price,discount,stock}=req.body
   const {id}=req.params

    const categoryexist=await categoryModel.findOne({_id:category})
    if(!categoryexist){
        return next(new AppError("Category not exist",409))
    }
    const subcategoryexist=await subCategoryModel.findOne({_id:subcategory,category})
    if(!subcategoryexist){
        return next(new AppError("subCategory not exist",409))
    }
    const brandexist=await brandModel.findOne({_id:brand})
    if(!brandexist){
        return next(new AppError("Brand already exist",409))
    }
    const product=await productModel.findOne({_id:id,createdBy:req.user._id})
    if(!product){
        return next(new AppError("Product not exist",409))
    }

    if(title){
        if(title.toLowerCase()==product.title){
            return next(new AppError("title match the old one",409))
        }
        if(await productModel.findOne({title:title.toLowerCase()})){
            return next(new AppError("title already exist",409))

        }
        product.title=title.toLowerCase()
        product.slug=slugify(title,{
            lower:true,
            replacement:"_"
        })
    }
    if(description){
        product.description=description
    }
    if(stock){
        product.stock=stock
    }
    if(price & discount){
        product.subprice=price - (price * (discount/100))
        product.price=price
        product.discount=discount
    }else if(price){
        product.subprice=price - (price * (product.discount/100))
        product.price=price
    }else if(discount){
        product.subprice=product.price - (product.price * (discount/100))
        product.discount=discount
    }

    if(req.files){
       if(req.files?.image?.length){
        await cloudinary.uploader.destroy(product.image.public_id)
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.image[0].path,
            { folder: `EcommerceC42/categories/${categoryexist.customId}/subcategories/${subcategoryexist.customId}/products/${product.customId}/mainImage`}
           )
           product.image={secure_url,public_id}
       }
       if(req.files?.coverimage?.length){
        await cloudinary.api.delete_resources_by_prefix( `EcommerceC42/categories/${categoryexist.customId}/subcategories/${subcategoryexist.customId}/products/${product.customId}/coverImage`)
        let list=[]
        for(const file of req.files.coverimage){
            const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,
             { folder: `EcommerceC42/categories/${categoryexist.customId}/subcategories/${subcategoryexist.customId}/products/${product.customId}/coverImage`}
            )
            list.push({secure_url,public_id})
        } 
        product.coverimage=list  
    }
    }
  await product.save()
    return res.status(200).json({message:"product updated successfully",product})
})