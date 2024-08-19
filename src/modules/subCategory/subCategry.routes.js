import { Router } from "express";
import * as SC from './subCategory.controller.js'
import * as SCV from './subCategory.validation.js'
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
const subcatrouter =Router({mergeParams:true});


subcatrouter.post("/",
    multerHost(validExtensions.image).single("image"),
    validation(SCV.createsubcategory),
    auth([systemRoles.admin]),
    SC.addsubCat
)
subcatrouter.put("/:id",
    multerHost(validExtensions.image).single("image"),
    validation(SCV.updatesubcategory),
    auth([systemRoles.admin]),
    SC.updatesubcat
)
subcatrouter.get("/",
    // auth(Object.values(systemRoles)),
    SC.getSubcategory
)
export default subcatrouter