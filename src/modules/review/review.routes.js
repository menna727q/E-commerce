import { Router } from "express";
import * as RC from './review.controller.js'
import * as RV from './review.validation.js'
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
const reviewrouter =Router({mergeParams:true});

reviewrouter.post("/",
    validation(RV.createReview),
    auth([systemRoles.admin]),
    RC.createReview
)
reviewrouter.delete("/:id",
    validation(RV.deleteReview),
    auth([systemRoles.admin]),
    RC.deleteReview
)

export default reviewrouter