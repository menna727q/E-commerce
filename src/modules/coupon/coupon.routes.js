import { Router } from "express";
import * as COC from './coupon.controller.js'
import * as COV from './coupon.validation.js'
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
const cuponrouter =Router();

cuponrouter.post("/",
    validation(COV.createCoupon),
    auth([systemRoles.admin]),
    COC.createCoupon
)
cuponrouter.put("/:id",
    validation(COV.updateCoupon),
    auth([systemRoles.admin]),
    COC.updateCoupon
)

export default cuponrouter