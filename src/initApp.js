import connectionDB from "../db/connection.js";
import { AppError } from "../src/utils/classError.js";
import { GlobalErrorHandler } from "../src/utils/asyncHandler.js";
// import { userRouter } from "./modules/users/user.routes.js";

import * as routers from '../src/modules/index.routes.js'
import { deletefromCloudinary } from "./utils/deletefromCloudinary.js";
import { deleteFromDb } from "./utils/deleteFromDb.js";
import cors from "cors"


export const initApp = (express, app) => {

     app.use(cors())
    app.use(express.json());

    //connect to db
    connectionDB()

    app.use('/user',routers.userRouter)
    app.use('/category',routers.categoryRouter)
    app.use("/sub",routers.subcatrouter)
    app.use("/brands",routers.brandrouter)
    app.use("/product",routers.productrouter)
    app.use("/coupon",routers.cuponrouter)
    app.use("/cart",routers.cartrouter)
    app.use("/order",routers.orderrouter)
    app.use("/review",routers.reviewrouter)
    app.use("/wish",routers.wishrouter)

    //handle invalid URLs.
    app.use("*", (req, res, next) => {
        next(new AppError(`inValid url ${req.originalUrl}`))
    })
    //GlobalErrorHandler
    app.use(GlobalErrorHandler,deletefromCloudinary,deleteFromDb)


 

}