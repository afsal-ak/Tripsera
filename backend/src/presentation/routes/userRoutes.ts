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
import { refreshToken } from "@presentation/controllers/token/refreshToken";
import { UserAuthController } from "@presentation/controllers/user/userAuthController";
import { userAuthMiddleware } from "@presentation/middlewares/userAuthMiddleware";
import { HomeUseCases } from "@domain/usecases/user/homeUseCases";
 import { HomeController } from "@presentation/controllers/user/homeController";
import { MongoBannerRepository } from "@infrastructure/repositories/MongoBannerRepository";
import { MongoPackageRepository } from "@infrastructure/repositories/MongoPackageRepository";
import { PackageUseCases } from "@domain/usecases/admin/packageUseCases";



const userRepository = new MongoUserRepository();
const otpRepository = new MongoOtpRepository();
const userAuthUseCases = new UserAuthUsecases(userRepository, otpRepository);
const userAuthController = new UserAuthController(userAuthUseCases);

const bannerRepository=new MongoBannerRepository()
const packageRepository=new MongoPackageRepository()
const homeUseCases=new HomeUseCases(packageRepository,bannerRepository)
 const homeController=new HomeController(homeUseCases)

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
router.post("/resend-otp",  userAuthController.resendOtp);

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
router.post('/google-login',userAuthController.googleLogin)


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
router.post('/verify-otp', userAuthController.verifyOtpForForgotPassword);

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


router.post('/logout', userAuthController.userLogout);


router.get('/home',homeController.getHome)
 
// /**
//  * @swagger
//  * /api/user/packages:
//  *   get:
//  *     summary: Get Active Packages
//  *     tags: [Packages]
//  *     description: Get paginated, filtered, and sorted list of active packages
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *         description: Page number for pagination
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 8
//  *         description: Number of packages per page
//  *       - in: query
//  *         name: sort
//  *         schema:
//  *           type: string
//  *           enum: [newest, oldest, price_asc, price_desc]
//  *           default: newest
//  *         description: Sorting order
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Search by title or location
//  *       - in: query
//  *         name: category
//  *         schema:
//  *           type: string
//  *         description: Filter by category ID
//  *       - in: query
//  *         name: duration
//  *         schema:
//  *           type: string
//  *         description: Filter by duration in days
//  *     responses:
//  *       200:
//  *         description: Successfully fetched packages
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Active packages fetched successfully
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/Package'
//  *                 total:
//  *                   type: integer
//  *                   example: 40
//  *                 totalPages:
//  *                   type: integer
//  *                   example: 5
//  *                 currentPage:
//  *                   type: integer
//  *                   example: 1
//  *       500:
//  *         description: Server error
//  */

router.get('/packages',userAuthMiddleware,homeController.getActivePackage)
router.get('/packages/:id',homeController.getPackagesById)



export default router;
