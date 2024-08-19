import joi from "joi"
import { generalFiled } from "../../utils/generalFields.js"

export const createOreder={
    body: joi.object({
        productId:generalFiled.id,
        quantity:joi.number().integer(),
        phone:joi.string().required(),
        address:joi.string().required(),
        couponcode:joi.string().min(3),
        paymentMethod:joi.string().valid("card","cash").required(),
    }).required(),
    headers:generalFiled.headers.required()
}
export const cancelOrder={
    body: joi.object({
        reason:joi.string().min(3),
    }),params:joi.object({
        id:generalFiled.id.required()
    }).required(),
    headers:generalFiled.headers.required()
}

