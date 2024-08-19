import { Router } from "express";
import * as OC from './order.controller.js'
import * as OV from './order.validation.js'
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
const orderrouter =Router();

orderrouter.post("/",
    validation(OV.createOreder),
    auth([systemRoles.admin]),
    OC.createOreder
)
orderrouter.put("/:id",
    validation(OV.cancelOrder),
    auth([systemRoles.admin]),
    OC.cancelOrder
)

export default orderrouter