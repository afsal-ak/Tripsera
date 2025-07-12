
import { Router } from "express";
import { upload } from "@presentation/middlewares/upload";

import { UserAuthUsecases } from "@domain/usecases/user/userAuthUseCases";
import { MongoUserRepository } from "@infrastructure/repositories/MongoUserRepository";
import { MongoOtpRepository } from "@infrastructure/repositories/MongoOtpRepository";
import { refreshToken } from "@presentation/controllers/token/refreshToken";
import { UserAuthController } from "@presentation/controllers/user/UserAuthController";
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
import { ProfileUseCases } from "@domain/usecases/user/profileUseCases";
import { ProfileController } from "@presentation/controllers/user/profileController";

import { WalletController } from "@presentation/controllers/user/walletController";
import { WalletUseCases } from "@domain/usecases/user/walletUseCases";
import { MongoWalletRepository } from "@infrastructure/repositories/MongoWalletRepository ";

const walletRepository=new MongoWalletRepository()
const walletUseCases=new WalletUseCases(walletRepository)
const walletController=new WalletController(walletUseCases)


const userRepository = new MongoUserRepository();
const otpRepository = new MongoOtpRepository();
const userAuthUseCases = new UserAuthUsecases(userRepository, otpRepository,walletRepository);
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

const profileRepository=new MongoUserRepository()
const profileUseCases=new ProfileUseCases(profileRepository)
const profileController=new ProfileController(profileUseCases)


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
router.get('/packages',homeController.getActivePackage)
router.get('/packages/:id',homeController.getPackagesById)

//profileRoutes
router.get('/profile',userAuthMiddleware,profileController.getUserProfile)
router.put('/profile/update',userAuthMiddleware,profileController.updateUserProfile)
router.put('/profile/uploadProfileImage',userAuthMiddleware,upload.single('image'),profileController.updateProfileImage)
router.put('/profile/updateAddress',userAuthMiddleware,profileController.updateUserAddress)

//wishlist routes
router.get('/wishlist',userAuthMiddleware,wishlistController.getAllWishlist)
router.get('/wishlist/check',userAuthMiddleware, wishlistController.checkPackageInWishlist);
router.post('/wishlist/add',userAuthMiddleware,wishlistController.addToWishlist)
router.delete('/wishlist/delete',userAuthMiddleware,wishlistController.removeFromWishlist)

//coupon routes
router.get('/coupons',userAuthMiddleware,couponController.getActiveCoupons)
router.post('/coupon/apply',userAuthMiddleware,couponController.applyCoupon)

//wallet routes
router.get('/wallet',userAuthMiddleware,walletController.getUserWallet)
router.post('/wallet/credit',userAuthMiddleware,walletController.creditWallet)
router.post('/wallet/debit',userAuthMiddleware,walletController.debitWallet)


export default router;
