import { Router } from "express";
import * as CAC from './cart.controller.js'
import * as CAV from './cart.validation.js'
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
const cartrouter =Router();

cartrouter.post("/",
    validation(CAV.createCart),
    auth(Object.values(systemRoles)),
    CAC.createCart
)
cartrouter.patch("/",
    validation(CAV.removeCart),
    auth(Object.values(systemRoles)),
    CAC.removeCart
)
cartrouter.put("/",
    validation(CAV.clearCart),
    auth(Object.values(systemRoles)),
    CAC.clearCart
)

export default cartrouter