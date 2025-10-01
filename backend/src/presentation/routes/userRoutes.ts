import { Router } from 'express';
import { upload } from '@presentation/middlewares/upload';
import { chatUpload } from '@presentation/middlewares/chatUpload';
import { userAuthMiddleware } from '@presentation/middlewares/userAuthMiddleware';
import { checkBlockedMiddleware } from '@presentation/middlewares/checkBlockedMiddleware ';
import {
  AUTH_ROUTES,
  HOME_ROUTES,
  PROFILE_ROUTES,
  USER_ROUTES,
  WISHLIST_ROUTES,
  COUPON_ROUTES,
  WALLET_ROUTES,
  BOOKING_ROUTES,
  BLOG_ROUTES,
  REVIEW_ROUTE,
  REPORT_ROUTE,
  CUSTOM_PACKAGE_ROUTE,
  CHAT_ROOM_ROUTE,
  MESSAGE_ROUTE,
  NOTIFICATION_ROUTE,
  BLOCK_ROUTE,
} from 'constants/route-constants/userRoutes';

import { UserAuthUsecases } from '@application/usecases/user/userAuthUseCases';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { OtpRepository } from '@infrastructure/repositories/OtpRepository';
import { userRefreshToken } from '@presentation/controllers/token/userRefreshToken';
import { optionalAuthMiddleware } from '@presentation/middlewares/optionalAuthMiddleware ';
import { UserAuthController } from '@presentation/controllers/user/UserAuthController';
import { HomeUseCases } from '@application/usecases/user/homeUseCases';
import { HomeController } from '@presentation/controllers/user/homeController';
import { BannerRepository } from '@infrastructure/repositories/BannerRepository';
import { PackageRepository } from '@infrastructure/repositories/PackageRepository';
//import { userAuthMiddleware } from '@presentation/middlewares/userAuthMiddleware';

import { WishlistController } from '@presentation/controllers/user/wishlistController';
import { WishlistUseCases } from '@application/usecases/user/wishlistUseCases';
import { WishlistRepository } from '@infrastructure/repositories/WishlistRepository';

import { CouponController } from '@presentation/controllers/user/couponController';
import { CouponUseCases } from '@application/usecases/user/couponUseCases';
import { CouponRepository } from '@infrastructure/repositories/CouponRepository';
import { ProfileUseCases } from '@application/usecases/user/profileUseCases';
import { ProfileController } from '@presentation/controllers/user/profileController';

import { WalletController } from '@presentation/controllers/user/walletController';
import { WalletUseCases } from '@application/usecases/user/walletUseCases';
import { WalletRepository } from '@infrastructure/repositories/WalletRepository ';

import { BookingRepository } from '@infrastructure/repositories/BookingRepository';
import { BookingUseCases } from '@application/usecases/user/bookingUseCases';
import { BookingController } from '@presentation/controllers/user/bookingController';
import { RazorpayService } from '@infrastructure/services/razorpay/razorpayService';

import { BlogRepository } from '@infrastructure/repositories/BlogRepository';
import { BlogUseCases } from '@application/usecases/user/blogUseCases';
import { BlogController } from '@presentation/controllers/user/blogControllers';

import { ReviewRepository } from '@infrastructure/repositories/ReviewRepository';
import { ReviewUseCases } from '@application/usecases/user/reviewUseCase';
import { ReviewController } from '@presentation/controllers/user/reviewController';

import { ReferralRepository } from '@infrastructure/repositories/ReferralRepository';

import { ReportRepository } from '@infrastructure/repositories/ReportRepository';
import { ReportUseCases } from '@application/usecases/user/reportUseCases';
import { ReportController } from '@presentation/controllers/user/reportController';

import { CustomPackageRepository } from '@infrastructure/repositories/CustomPackageRepository';
import { CustomPackageUseCases } from '@application/usecases/user/customPackageUseCases';
import { CustomPackageController } from '@presentation/controllers/user/customPackageController';

import { GeminiChatbotService } from '@infrastructure/services/chatbot/GeminiChatService';
import { ChatbotUseCase } from '@application/usecases/user/chatBotUseCase';
import { ChatController } from '@presentation/controllers/user/chatbotController';

import { ChatRoomRepository } from '@infrastructure/repositories/ChatRoomRepository';
import { ChatRoomUseCase } from '@application/usecases/chat/chatRoomUseCases';
import { ChatRoomController } from '@presentation/controllers/chat/ChatRoomController';

import { MessageRepository } from '@infrastructure/repositories/MessageRepository';
import { MessageUseCases } from '@application/usecases/chat/messageUseCases';
import { MessageController } from '@presentation/controllers/chat/MessageController';

import { NotificationUseCases } from '@application/usecases/notification/notificationUseCases';
import { NotificationRepository } from '@infrastructure/repositories/NotificationRepository';
import { NotificationController } from '@presentation/controllers/user/notificationController';
import { NotificationSocketService } from '@infrastructure/sockets/NotificationSocketService';
import { io } from 'app';

import { BlockController } from '@presentation/controllers/user/blockController';
import { BlockUseCase } from '@application/usecases/user/blockUseCases';
import { BlockRepository } from '@infrastructure/repositories/BlockRepository';

const chatbotService = new GeminiChatbotService(process.env.GEMINI_API_KEY!);
const chatbotUseCase = new ChatbotUseCase(chatbotService);
const chatController = new ChatController(chatbotUseCase);

const chatRoomRepository = new ChatRoomRepository();
const chatRoomUseCase = new ChatRoomUseCase(chatRoomRepository);
const chatRoomController = new ChatRoomController(chatRoomUseCase);

const messageRepository=new MessageRepository()
const messageUseCases=new MessageUseCases(messageRepository,chatRoomRepository)
const messageController=new MessageController(messageUseCases)


const walletRepository = new WalletRepository();
const walletUseCases = new WalletUseCases(walletRepository);
const walletController = new WalletController(walletUseCases);

const referralRepository = new ReferralRepository();

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const userAuthUseCases = new UserAuthUsecases(
  userRepository,
  otpRepository,
  walletRepository,
  referralRepository
);
const userAuthController = new UserAuthController(userAuthUseCases);


const bannerRepository = new BannerRepository();
const packageRepository = new PackageRepository();
const homeUseCases = new HomeUseCases(packageRepository, bannerRepository);
const homeController = new HomeController(homeUseCases);

const wishlistRepository = new WishlistRepository();
const wishlistUseCases = new WishlistUseCases(wishlistRepository);
const wishlistController = new WishlistController(wishlistUseCases);

const couponRepository = new CouponRepository();
const couponUseCases = new CouponUseCases(couponRepository);
const couponController = new CouponController(couponUseCases);


const notificationRepository=new NotificationRepository()
const notificationUseCases=new NotificationUseCases(notificationRepository,userRepository,packageRepository)
const notificationController=new NotificationController(notificationUseCases)

const profileRepository = new UserRepository();
const profileUseCases = new ProfileUseCases(profileRepository,notificationUseCases);
const profileController = new ProfileController(profileUseCases);

 const notificationSocketService=new NotificationSocketService(io,notificationUseCases)


const bookingRepository = new BookingRepository();
const razorpayService = new RazorpayService();
const bookingUseCases = new BookingUseCases(bookingRepository, walletRepository,userRepository,packageRepository,razorpayService,notificationUseCases);
const bookingController = new BookingController(bookingUseCases);

const blogRepository = new BlogRepository();
const blogUseCases = new BlogUseCases(blogRepository);
const blogController = new BlogController(blogUseCases);

const reviewRepository = new ReviewRepository();
const reviewUseCases = new ReviewUseCases(reviewRepository, bookingRepository,userRepository,packageRepository);
const reviewController = new ReviewController(reviewUseCases);

const reportRepository = new ReportRepository();
const reportUseCases = new ReportUseCases(reportRepository,userRepository,reviewRepository,blogRepository,notificationUseCases);
const reportController = new ReportController(reportUseCases);

const customPkgRepository = new CustomPackageRepository();
const customPkgUseCases = new CustomPackageUseCases(customPkgRepository,userRepository,notificationUseCases);
const customPkgController = new CustomPackageController(customPkgUseCases);

const blockRepository = new BlockRepository();
const blockUseCases = new BlockUseCase(blockRepository);
const blockController = new BlockController(blockUseCases);


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
router.post(
  AUTH_ROUTES.EMAIL_REQUEST_CHANGE,
  userAuthMiddleware,
  userAuthController.requestEmailChange
);
router.post(
  AUTH_ROUTES.EMAIL_VERIFY_CHANGE,
  userAuthMiddleware,
  userAuthController.verifyAndUpdateEmail
);
router.post(AUTH_ROUTES.PASSWORD_CHANGE, userAuthMiddleware, userAuthController.changePassword);


router.get(USER_ROUTES.SEARCH_USERS_FOR_CHAT,userAuthMiddleware,userAuthController.searchUsersForChat)

// HOME ROUTES
router.get(HOME_ROUTES.HOME, homeController.getHome);
router.get(HOME_ROUTES.PACKAGES, homeController.getActivePackage);
router.get(HOME_ROUTES.PACKAGE_BY_ID, homeController.getPackagesById);

// PROFILE ROUTES
router.get(PROFILE_ROUTES.GET_PROFILE, userAuthMiddleware, profileController.getUserProfile);
router.put(PROFILE_ROUTES.UPDATE_PROFILE, userAuthMiddleware, profileController.updateUserProfile);
router.put(
  PROFILE_ROUTES.UPLOAD_PROFILE_IMAGE,
  userAuthMiddleware,
  upload.single('image'),
  profileController.updateProfileImage
);
router.put(
  PROFILE_ROUTES.CREATE_COVER_IMAGE,
  userAuthMiddleware,
  upload.single('image'),
  profileController.createCoverImage
);
router.get(PROFILE_ROUTES.UPDATE_ADDRESS, userAuthMiddleware, profileController.updateUserAddress);

//for public
router.get(
  PROFILE_ROUTES.GET_PUBLIC_PROFILE,
  userAuthMiddleware,checkBlockedMiddleware,
  profileController.getPublicProfile
);
router.post(PROFILE_ROUTES.FOLLOW, userAuthMiddleware, profileController.followUser);
router.post(PROFILE_ROUTES.UNFOLLOW, userAuthMiddleware, profileController.unfollowUser);
router.patch(PROFILE_ROUTES.SET_PROFILE_PRIVACY, userAuthMiddleware, profileController.setProfilePrivacy);

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
router.post(
  BOOKING_ROUTES.ONLINE_BOOKING,
  userAuthMiddleware,
  bookingController.createBookingWithOnlinePayment
);
router.post(
  BOOKING_ROUTES.VERIFY_PAYMENT,
  userAuthMiddleware,
  bookingController.verifyRazorpayPayment
);
router.patch(
  BOOKING_ROUTES.CANCEL_UNPAID,
  userAuthMiddleware,
  bookingController.cancelUnpaidBooking
);
router.post(
  BOOKING_ROUTES.RETRY_PAYMENT,
  userAuthMiddleware,
  bookingController.retryBookingPayment
);
router.post(
  BOOKING_ROUTES.WALLET_BOOKING,
  userAuthMiddleware,
  bookingController.createBookingWithWalletPayment
);
router.get(
  BOOKING_ROUTES.INVOICE_DOWNLOAD,
  userAuthMiddleware,
  bookingController.downloadInvoice
);


// BLOG ROUTES
router.post(
  BLOG_ROUTES.CREATE,
  userAuthMiddleware,
  upload.array('images'),
  blogController.createBlog
);
router.put(BLOG_ROUTES.EDIT, userAuthMiddleware, upload.array('images'), blogController.editBlog);
router.get(BLOG_ROUTES.GET_ALL, blogController.getAllPublishedBlogs);
router.get(BLOG_ROUTES.GET_USER_BLOGS, userAuthMiddleware, blogController.getBlogByUser);
router.get(
  BLOG_ROUTES.GET_PUBLIC_USER_BLOGS,
  userAuthMiddleware,checkBlockedMiddleware,
  blogController.getPublicBlogsByUser
);
router.get(BLOG_ROUTES.GET_BY_ID, userAuthMiddleware, blogController.getBlogById);
router.get(BLOG_ROUTES.GET_BY_SLUG, optionalAuthMiddleware,checkBlockedMiddleware, blogController.getBySlug);
router.delete(BLOG_ROUTES.DELETE, userAuthMiddleware, blogController.deleteBlog);
router.patch(BLOG_ROUTES.LIKE, userAuthMiddleware, blogController.likeBlog);
router.patch(BLOG_ROUTES.UNLIKE, userAuthMiddleware, blogController.unLikeBlog);
router.get(BLOG_ROUTES.BLOG_LIKE_LIST, userAuthMiddleware, blogController.getBlogLikeList);

//REVIEW ROUTES

router.post(REVIEW_ROUTE.CREATE, userAuthMiddleware, reviewController.createReview);
router.put(REVIEW_ROUTE.UPDATE, userAuthMiddleware, reviewController.updateReview);
router.get(REVIEW_ROUTE.GET_USER_REVIEWS, userAuthMiddleware, reviewController.getUserReview);
router.get(REVIEW_ROUTE.GET_BY_ID, userAuthMiddleware, reviewController.getReviewById);
router.get(REVIEW_ROUTE.GET_BY_PACKAGE, reviewController.getPackageReviews);
router.delete(REVIEW_ROUTE.DELETE, userAuthMiddleware, reviewController.deleteReview);
router.get(REVIEW_ROUTE.GET_REVIEW_RATING, reviewController.getRatingSummary);

//REPORT ROUTES

router.post(REPORT_ROUTE.CREATE,userAuthMiddleware,reportController.createReport)

//CUSTOM PACAKGE ROUTES

router.post(CUSTOM_PACKAGE_ROUTE.CREATE, userAuthMiddleware, customPkgController.createCustomPkg);
router.put(CUSTOM_PACKAGE_ROUTE.UPDATE, userAuthMiddleware, customPkgController.updateCustomPkg);
router.get(CUSTOM_PACKAGE_ROUTE.GET_BY_ID, userAuthMiddleware, customPkgController.getCustomPkgById);
router.get(CUSTOM_PACKAGE_ROUTE.GET_ALL_PKG, userAuthMiddleware, customPkgController.getAllCustomPkgs);
router.delete(CUSTOM_PACKAGE_ROUTE.DELETE, userAuthMiddleware,customPkgController.deleteCustomPkg);

//CHATBOT
router.post('/chatbot', userAuthMiddleware, chatController.chatBot);

//CHAT ROOM ROUTES
 router.post(CHAT_ROOM_ROUTE.CREATE, userAuthMiddleware, chatRoomController.createRoom);
router.put(CHAT_ROOM_ROUTE.UPDATE, userAuthMiddleware, chatRoomController.updateRoom);
router.get(CHAT_ROOM_ROUTE.GET_BY_ID, userAuthMiddleware, chatRoomController.getRoomById);
router.get(CHAT_ROOM_ROUTE.GET_USER_ROOMS, userAuthMiddleware, chatRoomController.getUserRooms);
router.delete(CHAT_ROOM_ROUTE.DELETE, userAuthMiddleware,chatRoomController.deleteRoom);

//MESSAGE ROUTES
 //router.post(MESSAGE_ROUTE.SEND, userAuthMiddleware, messageController.sendMessage);
 router.get(MESSAGE_ROUTE.GET_BY_ROOM, userAuthMiddleware, messageController.getMessages);
//router.patch(MESSAGE_ROUTE.MARK_AS_READ, userAuthMiddleware, messageController.markMessageRead);
// router.delete(MESSAGE_ROUTE.DELETE, userAuthMiddleware,messageController.deleteMessage);
 router.post(MESSAGE_ROUTE.UPLOAD_MEDIA, userAuthMiddleware,chatUpload.single('file'), messageController.uploadMediaToChat);

router.get(NOTIFICATION_ROUTE.FETCH_NOTIFICATION,userAuthMiddleware,notificationController.getNotifications)
 router.patch(NOTIFICATION_ROUTE.MARK_AS_READ,userAuthMiddleware,notificationController.markAsRead)



router.get(BLOCK_ROUTE.GELL_ALL,userAuthMiddleware,blockController.listBlockedUsers)
router.post(BLOCK_ROUTE.BLOCK,userAuthMiddleware,blockController.block)
router.put(BLOCK_ROUTE.UNBLOCK,userAuthMiddleware,blockController.unblock)
router.get(BLOCK_ROUTE.IS_BLOCKED,userAuthMiddleware,blockController.isBlocked)


export default router;
