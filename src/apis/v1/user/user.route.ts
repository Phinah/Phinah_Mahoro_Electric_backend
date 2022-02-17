import { celebrate } from "celebrate";
import { Router } from "express";
import asyncHandler from "../../../middlewares/async.handler";
import checkAdmin from "../../../middlewares/check.admin";
import checkAuth from "../../../middlewares/check.auth";
import { UserController } from "./user.controller";
import { completeRegister, createUser, loginUser } from "./user.validator";


const router = Router()

router.route('/login')
    .post(
    celebrate({
        body:loginUser
    }),
    asyncHandler(UserController.login)
)

router.route('/register')
    .post(
        checkAdmin(),
        celebrate({
            body:createUser
        }),
        asyncHandler(UserController.registerUser)
    )

router.route('/register/complete')
    .post(
        celebrate({
            body:completeRegister
        }),
        asyncHandler(UserController.completeRegisteration)
)
router.route('/logout')
    .post(
        checkAuth(),
        asyncHandler(UserController.logout)
    )
export default router;