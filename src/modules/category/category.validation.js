import joi from "joi"
import { generalFiled } from "../../utils/generalFields.js"

export const createcategory={
    body: joi.object({
        name:joi.string().min(3).max(30).required(),


    }).required(),
    file: generalFiled.file.required(),
    headers:generalFiled.headers.required()
}
export const updatecategory={
    body: joi.object({
        name:joi.string().min(3).max(30),


    }).required(),
    file: generalFiled.file,
    headers:generalFiled.headers.required()
}