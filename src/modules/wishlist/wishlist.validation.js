import joi from "joi"
import { generalFiled } from "../../utils/generalFields.js"

export const createWishlist={
    params:joi.object({
        productId:generalFiled.id.required()
       }).required(),
    headers:generalFiled.headers.required()
}


