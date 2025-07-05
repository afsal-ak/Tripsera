
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

import { WishlistController } from "@presentation/controllers/user/wishlistController";
import { WishlistUseCases } from "@domain/usecases/user/wishlistUseCases";
import { MongoWishlistRepository } from "@infrastructure/repositories/MongoWishlistRepository";

import { CouponController } from "@presentation/controllers/user/couponController";
import { CouponUseCases } from "@domain/usecases/user/couponUseCases";
import { MongoCouponRepository } from "@infrastructure/repositories/MongoCouponRepository";


const userRepository = new MongoUserRepository();
const otpRepository = new MongoOtpRepository();
const userAuthUseCases = new UserAuthUsecases(userRepository, otpRepository);
const userAuthController = new UserAuthController(userAuthUseCases);

const bannerRepository=new MongoBannerRepository()
const packageRepository=new MongoPackageRepository()
const homeUseCases=new HomeUseCases(packageRepository,bannerRepository)
 const homeController=new HomeController(homeUseCases)

 const wishlistRepository=new MongoWishlistRepository()
 const wishlistUseCases=new WishlistUseCases(wishlistRepository)
 const wishlistController=new WishlistController(wishlistUseCases)

const couponRepository=new MongoCouponRepository()
const couponUseCases=new CouponUseCases(couponRepository)
const couponController=new CouponController(couponUseCases)


const router = Router();

//auth routes
router.post('/refresh-token', refreshToken);
router.post('/pre-register', userAuthController.preRegister);
router.post('/register', userAuthController.register);
router.post("/resend-otp",  userAuthController.resendOtp);
router.post('/login', userAuthController.login);
router.post('/google-login',userAuthController.googleLogin)
router.post('/forgotPassword', userAuthController.forgotPassword);
router.post('/verify-otp', userAuthController.verifyOtpForForgotPassword);
router.post('/forgotPasswordChange', userAuthController.forgotPasswordChange);
router.post('/logout', userAuthController.userLogout);
router.post("/email/request-change", userAuthMiddleware, userAuthController.requestEmailChange);
router.post("/email/verify-change", userAuthMiddleware, userAuthController.verifyAndUpdateEmail);
router.post("/password/change", userAuthMiddleware, userAuthController.changePassword);



//
router.get('/home',homeController.getHome)
router.get('/packages',userAuthMiddleware,homeController.getActivePackage)
router.get('/packages/:id',homeController.getPackagesById)

//wishlist routes
router.get('/wishlist',userAuthMiddleware,wishlistController.getAllWishlist)
router.post('/wishlistAdd',userAuthMiddleware,wishlistController.addToWishlist)
router.delete('/wishlist/delete',userAuthMiddleware,wishlistController.removeFromWishlist)

//coupon routes
router.get('/coupons',userAuthMiddleware,couponController.getActiveCoupons)
router.post('/coupon/apply',userAuthMiddleware,couponController.applyCoupon)

export default router;
