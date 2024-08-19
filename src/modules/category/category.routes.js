import { Router } from "express";
import * as CC from './category.controller.js'
import * as CV from './category.validation.js'
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import subcatrouter from "../subCategory/subCategry.routes.js";
import { systemRoles } from "../../utils/systemRoles.js";
const router =Router();

router.use("/:categoryId/subcategories", subcatrouter)

router.post("/add",
    multerHost(validExtensions.image).single("image"),
    validation(CV.createcategory),
    auth(["admin"]),
    CC.addCat
)
router.put("/:id",
    multerHost(validExtensions.image).single("image"),
    validation(CV.updatecategory),
    auth(["admin"]),
    CC.updatecat
)
router.get("/",
    // auth(Object.values(systemRoles)),
    CC.getcategories
)
router.delete("/:id",
    auth(Object.values(systemRoles)),
    CC.deletecategory
)
export default router