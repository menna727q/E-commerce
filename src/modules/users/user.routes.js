import { Router } from "express";
import * as UC from './user.controller.js'
const router =Router();


router.post('/signup',UC.signup)
router.post('/signin',UC.signin)
router.get('/verifyEmail/:token',UC.verifyEmail)
router.get('/refreshToken/:reftoken',UC.refreshToken)
router.patch('/sendCode',UC.forgetPassword)
router.patch('/resetpass',UC.resetPassword)




export default router