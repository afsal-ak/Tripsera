// import { Router } from "express";
// import { UserAuthUsecases } from "@domain/usecases/user/userAuthUseCases";
// import { MongoUserRepository } from "@infrastructure/repositories/MongoUserRepository";
// import { MongoOtpRepository } from "@infrastructure/repositories/MongoOtpRepository";
// import { UserAuthController } from "@presentation/controllers/user/UserAuthController";
// import { refreshToken } from "@presentation/controllers/token/refreshToken";
// import { userAuthMiddleware } from "@presentation/middlewares/userAuthMiddleware";

// const userRepository=new MongoUserRepository();
// const otpRepository=new MongoOtpRepository();
// const userAuthUseCases=new UserAuthUsecases(userRepository,otpRepository)
// const userAuthController=new UserAuthController(userAuthUseCases)

// const router=Router()
// router.post('/refresh-token',refreshToken)
// router.post('/pre-register',userAuthController.preRegister)
// router.post('/register',  userAuthController.register);
// router.post('/login', userAuthController.login);
// router.post('/forgotPassword',userAuthController.forgotPassword)
// router.post('/forgotPasswordChange',userAuthController.forgotPasswordChange)
// router.post("/logout", userAuthMiddleware, userAuthController.userLogout);

// export default router;


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication APIs
 */

import { Router } from "express";
import { UserAuthUsecases } from "@domain/usecases/user/userAuthUseCases";
import { MongoUserRepository } from "@infrastructure/repositories/MongoUserRepository";
import { MongoOtpRepository } from "@infrastructure/repositories/MongoOtpRepository";
import { UserAuthController } from "@presentation/controllers/user/UserAuthController";
import { refreshToken } from "@presentation/controllers/token/refreshToken";
import { userAuthMiddleware } from "@presentation/middlewares/userAuthMiddleware";

const userRepository = new MongoUserRepository();
const otpRepository = new MongoOtpRepository();
const userAuthUseCases = new UserAuthUsecases(userRepository, otpRepository);
const userAuthController = new UserAuthController(userAuthUseCases);

const router = Router();

/**
 * @swagger
 * /api/user/refresh-token:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/user/pre-register:
 *   post:
 *     summary: Send OTP for user signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post('/pre-register', userAuthController.preRegister);

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', userAuthController.register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', userAuthController.login);

/**
 * @swagger
 * /api/user/forgotPassword:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent for reset
 */
router.post('/forgotPassword', userAuthController.forgotPassword);

/**
 * @swagger
 * /api/user/forgotPasswordChange:
 *   post:
 *     summary: Change password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 */
router.post('/forgotPasswordChange', userAuthController.forgotPasswordChange);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', userAuthMiddleware, userAuthController.userLogout);

export default router;
