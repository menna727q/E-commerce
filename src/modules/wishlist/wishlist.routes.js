import { Router } from "express";
import * as WC from './wishlist.controller.js'
import * as WV from './wishlist.validation.js'
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
const wishrouter =Router({mergeParams:true});

wishrouter.post("/",
    validation(WV.createWishlist),
    auth(Object.values(systemRoles)),
    WC.createWishlist
)


export default wishrouter