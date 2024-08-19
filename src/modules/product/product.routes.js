import { Router } from "express";
import * as PC from './product.controller.js'
import * as PV from './product.validation.js'
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
import  reviewrouter  from "../review/review.routes.js";
import  wishrouter  from "../wishlist/wishlist.routes.js";
const productrouter =Router();
productrouter.use("/:productId/review",reviewrouter)
productrouter.use("/:productId/wishlist",wishrouter)


productrouter.post("/",
    multerHost(validExtensions.image).fields([
        {name:"image",maxCount:1},
        {name:"coverimage",maxCount:3}
    ]),
    validation(PV.createProduct),
    auth([systemRoles.admin]),
    PC.createproduct
)
productrouter.put("/:id",
    multerHost(validExtensions.image).fields([
        {name:"image",maxCount:1},
        {name:"coverimage",maxCount:3}
    ]),
    validation(PV.updateProduct),
    auth([systemRoles.admin]),
    PC.updateproduct
)
productrouter.get("/",
    PC.getproducts
)

export default productrouter