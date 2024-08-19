import  userRouter  from "./users/user.routes.js";
import categoryRouter from './category/category.routes.js'
import subcatrouter from "./subCategory/subCategry.routes.js"
import brandrouter from "./brand/brand.routes.js"
import productrouter from "./product/product.routes.js"
import cuponrouter from "./coupon/coupon.routes.js"
import cartrouter from "./Cart/cart.routes.js"
import orderrouter from "./order/order.routes.js"

import reviewrouter from "./review/review.routes.js";

import wishrouter from "./wishlist/wishlist.routes.js";
export{
    userRouter,
    categoryRouter,
    subcatrouter,
    brandrouter,
    productrouter,
    cuponrouter,
    cartrouter,
    orderrouter,
    reviewrouter,
    wishrouter
}