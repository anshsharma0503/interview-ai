const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access public 
 */
authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)


/**
 * @route GET /api/auth/logot
 * @description clear token from user cookie and add the token in the blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user detail
 * @access private
 */
authRouter.get("/get-me" , authMiddleware.authUser , authController.getMeController)


module.exports = authRouter