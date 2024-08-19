import joi from "joi"
import { generalFiled } from "../../utils/generalFields.js"

export const createProduct={
    body: joi.object({
        title:joi.string().min(3).max(30).required(),
        stock:joi.number().min(1).required(),
        description:joi.string(),
        category:generalFiled.id.required(),
        subcategory:generalFiled.id.required(),
        brand:generalFiled.id.required(),
        price:joi.number().integer().min(1).required(),
        discount:joi.number().min(1).max(100),
        
    }).required(),
    files: joi.object({
       image: joi.array().items(generalFiled.file.required()).required(),
       coverimage:joi.array().items(generalFiled.file.required()).required()
    }),
   
    headers:generalFiled.headers.required()
}
export const updateProduct={
    body: joi.object({
        title:joi.string().min(3).max(30),
        stock:joi.number().min(1),
        description:joi.string(),
        category:generalFiled.id.required(),
        subcategory:generalFiled.id.required(),
        brand:generalFiled.id.required(),
        price:joi.number().integer().min(1),
        discount:joi.number().min(1).max(100),
        
    }),
    params: joi.object({
        id:generalFiled.id.required(),
    }),
    files: joi.object({
       image: joi.array().items(generalFiled.file),
       coverimage:joi.array().items(generalFiled.file)
    }),
   
    headers:generalFiled.headers.required()
}

