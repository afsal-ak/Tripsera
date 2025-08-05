import { Router } from 'express';
import { upload } from '@presentation/middlewares/upload';
import {
  AUTH_ROUTES,
  HOME_ROUTES,
  PROFILE_ROUTES,
  WISHLIST_ROUTES,
  COUPON_ROUTES,
  WALLET_ROUTES,
  BOOKING_ROUTES,
  BLOG_ROUTES,
  REVIEW_ROUTE
} from 'constants/route-constants/userRoutes';
import { UserAuthUsecases } from '@application/usecases/user/userAuthUseCases';
import { MongoUserRepository } from '@infrastructure/repositories/MongoUserRepository';
import { MongoOtpRepository } from '@infrastructure/repositories/MongoOtpRepository';
import { userRefreshToken } from '@presentation/controllers/token/userRefreshToken';
import { UserAuthController } from '@presentation/controllers/user/UserAuthController';
import { userAuthMiddleware } from '@presentation/middlewares/userAuthMiddleware';
import { optionalAuthMiddleware } from '@presentation/middlewares/optionalAuthMiddleware ';
import { HomeUseCases } from '@application/usecases/user/homeUseCases';
import { HomeController } from '@presentation/controllers/user/homeController';
import { MongoBannerRepository } from '@infrastructure/repositories/MongoBannerRepository';
import { MongoPackageRepository } from '@infrastructure/repositories/MongoPackageRepository';

import { WishlistController } from '@presentation/controllers/user/wishlistController';
import { WishlistUseCases } from '@application/usecases/user/wishlistUseCases';
import { MongoWishlistRepository } from '@infrastructure/repositories/MongoWishlistRepository';

import { CouponController } from '@presentation/controllers/user/couponController';
import { CouponUseCases } from '@application/usecases/user/couponUseCases';
import { MongoCouponRepository } from '@infrastructure/repositories/MongoCouponRepository';
import { ProfileUseCases } from '@application/usecases/user/profileUseCases';
import { ProfileController } from '@presentation/controllers/user/profileController';

import { WalletController } from '@presentation/controllers/user/walletController';
import { WalletUseCases } from '@application/usecases/user/walletUseCases';
import { MongoWalletRepository } from '@infrastructure/repositories/MongoWalletRepository ';

import { MongoBookingRepository } from '@infrastructure/repositories/MongoBookingRepository';
import { BookingUseCases } from '@application/usecases/user/bookingUseCases';
import { BookingController } from '@presentation/controllers/user/bookingController';
import { RazorpayService } from '@infrastructure/services/razorpay/razorpayService';

import { MongoBlogRepository } from '@infrastructure/repositories/MongoBlogRepository';
import { BlogUseCases } from '@application/usecases/user/blogUseCases';
import { BlogController } from '@presentation/controllers/user/blogControllers';

import { ReviewRepository } from '@infrastructure/repositories/ReviewRepository';
import { ReviewUseCases } from '@application/usecases/user/reviewUseCase';
import { ReviewController } from '@presentation/controllers/user/reviewController';

import { ReferralRepository } from '@infrastructure/repositories/ReferralRepository';
  
const walletRepository = new MongoWalletRepository();
const walletUseCases = new WalletUseCases(walletRepository);
const walletController = new WalletController(walletUseCases);

const referralRepository = new ReferralRepository();


const userRepository = new MongoUserRepository();
const otpRepository = new MongoOtpRepository();
const userAuthUseCases = new UserAuthUsecases(userRepository, otpRepository, walletRepository,referralRepository);
const userAuthController = new UserAuthController(userAuthUseCases);

const bannerRepository = new MongoBannerRepository();
const packageRepository = new MongoPackageRepository();
const homeUseCases = new HomeUseCases(packageRepository, bannerRepository);
const homeController = new HomeController(homeUseCases);

const wishlistRepository = new MongoWishlistRepository();
const wishlistUseCases = new WishlistUseCases(wishlistRepository);
const wishlistController = new WishlistController(wishlistUseCases);

const couponRepository = new MongoCouponRepository();
const couponUseCases = new CouponUseCases(couponRepository);
const couponController = new CouponController(couponUseCases);

const profileRepository = new MongoUserRepository();
const profileUseCases = new ProfileUseCases(profileRepository);
const profileController = new ProfileController(profileUseCases);

const bookingRepository = new MongoBookingRepository();
const razorpayService = new RazorpayService();
const bookingUseCases = new BookingUseCases(bookingRepository, walletRepository, razorpayService);
const bookingController = new BookingController(bookingUseCases);

const blogRepository = new MongoBlogRepository();
const blogUseCases = new BlogUseCases(blogRepository);
const blogController = new BlogController(blogUseCases);

const reviewRepository = new ReviewRepository();
const reviewUseCases = new ReviewUseCases(reviewRepository,bookingRepository);
const reviewController = new ReviewController(reviewUseCases);


const router = Router();

// AUTH ROUTES
router.post(AUTH_ROUTES.REFRESH_TOKEN, userRefreshToken);
router.post(AUTH_ROUTES.PRE_REGISTER, userAuthController.preRegister);
router.post(AUTH_ROUTES.REGISTER, userAuthController.register);
router.post(AUTH_ROUTES.RESEND_OTP, userAuthController.resendOtp);
router.post(AUTH_ROUTES.LOGIN, userAuthController.login);
router.post(AUTH_ROUTES.GOOGLE_LOGIN, userAuthController.googleLogin);
router.post(AUTH_ROUTES.FORGOT_PASSWORD, userAuthController.forgotPassword);
router.post(AUTH_ROUTES.VERIFY_OTP, userAuthController.verifyOtpForForgotPassword);
router.post(AUTH_ROUTES.FORGOT_PASSWORD_CHANGE, userAuthController.forgotPasswordChange);
router.post(AUTH_ROUTES.LOGOUT, userAuthController.userLogout);
router.post(AUTH_ROUTES.EMAIL_REQUEST_CHANGE, userAuthMiddleware, userAuthController.requestEmailChange);
router.post(AUTH_ROUTES.EMAIL_VERIFY_CHANGE, userAuthMiddleware, userAuthController.verifyAndUpdateEmail);
router.post(AUTH_ROUTES.PASSWORD_CHANGE, userAuthMiddleware, userAuthController.changePassword);

// HOME ROUTES
router.get(HOME_ROUTES.HOME, homeController.getHome);
router.get(HOME_ROUTES.PACKAGES, homeController.getActivePackage);
router.get(HOME_ROUTES.PACKAGE_BY_ID, homeController.getPackagesById);

// PROFILE ROUTES
router.get(PROFILE_ROUTES.GET_PROFILE, userAuthMiddleware, profileController.getUserProfile);
router.put(PROFILE_ROUTES.UPDATE_PROFILE, userAuthMiddleware, profileController.updateUserProfile);
router.put(PROFILE_ROUTES.UPLOAD_PROFILE_IMAGE, userAuthMiddleware, upload.single('image'), profileController.updateProfileImage);
router.put(PROFILE_ROUTES.CREATE_COVER_IMAGE, userAuthMiddleware, upload.single('image'), profileController.createCoverImage);
router.put(PROFILE_ROUTES.UPDATE_ADDRESS, userAuthMiddleware, profileController.updateUserAddress);

// WISHLIST ROUTES
router.get(WISHLIST_ROUTES.GET_ALL, userAuthMiddleware, wishlistController.getAllWishlist);
router.get(WISHLIST_ROUTES.CHECK, userAuthMiddleware, wishlistController.checkPackageInWishlist);
router.post(WISHLIST_ROUTES.ADD, userAuthMiddleware, wishlistController.addToWishlist);
router.delete(WISHLIST_ROUTES.DELETE, userAuthMiddleware, wishlistController.removeFromWishlist);

// COUPON ROUTES
router.get(COUPON_ROUTES.GET_COUPONS, userAuthMiddleware, couponController.getActiveCoupons);
router.post(COUPON_ROUTES.APPLY, userAuthMiddleware, couponController.applyCoupon);

// WALLET ROUTES
router.get(WALLET_ROUTES.GET_WALLET, userAuthMiddleware, walletController.getUserWallet);
router.get(WALLET_ROUTES.BALANCE, userAuthMiddleware, walletController.walletBalance);
router.post(WALLET_ROUTES.CREDIT, userAuthMiddleware, walletController.creditWallet);
router.post(WALLET_ROUTES.DEBIT, userAuthMiddleware, walletController.debitWallet);

// BOOKING ROUTES
router.get(BOOKING_ROUTES.GET_BOOKINGS, userAuthMiddleware, bookingController.getUserBookings);
router.get(BOOKING_ROUTES.GET_BY_ID, userAuthMiddleware, bookingController.getBookingById);
router.patch(BOOKING_ROUTES.CANCEL, userAuthMiddleware, bookingController.cancelBooking);
router.post(BOOKING_ROUTES.ONLINE_BOOKING, userAuthMiddleware, bookingController.createBookingWithOnlinePayment);
router.post(BOOKING_ROUTES.VERIFY_PAYMENT, userAuthMiddleware, bookingController.verifyRazorpayPayment);
router.patch(BOOKING_ROUTES.CANCEL_UNPAID, userAuthMiddleware, bookingController.cancelUnpaidBooking);
router.post(BOOKING_ROUTES.RETRY_PAYMENT, userAuthMiddleware, bookingController.retryBookingPayment);
router.post(BOOKING_ROUTES.WALLET_BOOKING, userAuthMiddleware, bookingController.createBookingWithWalletPayment);

// BLOG ROUTES
router.post(BLOG_ROUTES.CREATE, userAuthMiddleware, upload.array('images'), blogController.createBlog);
router.put(BLOG_ROUTES.EDIT, userAuthMiddleware, upload.array('images'), blogController.editBlog);
router.get(BLOG_ROUTES.GET_ALL, blogController.getAllPublishedBlogs);
router.get(BLOG_ROUTES.GET_USER_BLOGS, userAuthMiddleware, blogController.getBlogByUser);
router.get(BLOG_ROUTES.GET_BY_ID, userAuthMiddleware, blogController.getBlogById);
 router.get(BLOG_ROUTES.GET_BY_SLUG,optionalAuthMiddleware, blogController.getBySlug);
router.delete(BLOG_ROUTES.DELETE, userAuthMiddleware, blogController.deleteBlog);
router.patch(BLOG_ROUTES.LIKE, userAuthMiddleware, blogController.likeBlog);
router.patch(BLOG_ROUTES.UNLIKE, userAuthMiddleware, blogController.unLikeBlog);

//REVIEW ROUTES

router.post(REVIEW_ROUTE.CREATE,userAuthMiddleware,reviewController.createReview)
router.get(REVIEW_ROUTE.GET_USER_REVIEWS,userAuthMiddleware,reviewController.getUserReview)
router.get(REVIEW_ROUTE.GET_BY_ID,userAuthMiddleware,reviewController.getReviewById)
router.get(REVIEW_ROUTE.GET_BY_PACKAGE,reviewController.getPackageReviews)
router.delete(REVIEW_ROUTE.DELETE,userAuthMiddleware,reviewController.deleteReview)
router.get(REVIEW_ROUTE.GET_REVIEW_RATING, reviewController.getRatingSummary);

export default router;
