import { Router } from 'express';
import {
  AUTH_ROUTES,
  USER_MANAGEMENT_ROUTES,
  BANNER_ROUTES,
  CATEGORY_ROUTES,
  PACKAGE_ROUTES,
  COUPON_ROUTES,
  BOOKING_ROUTES,
  BLOG_ROUTES,
  REVIEW_ROUTE,
  REFERRAL_ROUTE,
  SALES_REPORT_ROUTE,
  REPORT_ROUTE,
  CUSTOM_PACKAGE_ROUTE,
  DASHBOARD_ROUTE,
  MESSAGE_ROUTE,
  CHAT_ROOM_ROUTE,
  NOTIFICATION_ROUTE
} from 'constants/route-constants/adminRoutes';

import { adminAuthMiddleware } from '@presentation/middlewares/adminAuthMiddleware';
import { AdminAuthUseCases } from '@application/usecases/admin/adminAuthUseCases';
import { AdminAuthController } from '@presentation/controllers/admin/adminAuthController';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { OtpRepository } from '@infrastructure/repositories/OtpRepository';
import { adminRefreshToken } from '@presentation/controllers/token/adminRefreshToken';
import { UserManagementUseCases } from '@application/usecases/admin/userManagementUseCases';
import { UserManagementController } from '@presentation/controllers/admin/userMangementController';

import { upload } from '@presentation/middlewares/upload';
import { chatUpload } from '@presentation/middlewares/chatUpload';

import { BannerMangementController } from '@presentation/controllers/admin/bannerController';
import { BannerMangementUseCases } from '@application/usecases/admin/bannerUseCases';
import { BannerRepository } from '@infrastructure/repositories/BannerRepository';

import { CategoryUseCases } from '@application/usecases/admin/categoryUseCases';
import { CategoryController } from '@presentation/controllers/admin/categoryController';
import { CategoryRepository } from '@infrastructure/repositories/CategoryRepository';

import { PackageUseCases } from '@application/usecases/admin/packageUseCases';
import { PackageController } from '@presentation/controllers/admin/packageController';
import { PackageRepository } from '@infrastructure/repositories/PackageRepository';

import { CouponUseCases } from '@application/usecases/admin/couponUseCases';
import { CouponRepository } from '@infrastructure/repositories/CouponRepository';
import { CouponController } from '@presentation/controllers/admin/couponController';

import { BookingUseCases } from '@application/usecases/admin/bookingUseCases';
import { BookingRepository } from '@infrastructure/repositories/BookingRepository';
import { BookingController } from '@presentation/controllers/admin/bookingController';

import { WalletRepository } from '@infrastructure/repositories/WalletRepository ';

import { BlogRepository } from '@infrastructure/repositories/BlogRepository';
import { BlogUseCases } from '@application/usecases/admin/blogUseCases';
import { BlogController } from '@presentation/controllers/admin/blogController';

import { ReviewRepository } from '@infrastructure/repositories/ReviewRepository';
import { ReviewUseCases } from '@application/usecases/admin/reviewUseCase';
import { ReviewController } from '@presentation/controllers/admin/reviewController';

import { ReferralRepository } from '@infrastructure/repositories/ReferralRepository';
import { ReferralUseCase } from '@application/usecases/admin/referralUseCases.ts';
import { ReferralController } from '@presentation/controllers/admin/referralController';

import { SalesReportRepository } from '@infrastructure/repositories/SalesReportRepository';
import { SalesReportUseCase } from '@application/usecases/admin/salesReportUseCase';
import { SalesReportController } from '@presentation/controllers/admin/salesReportController';

import { ReportRepository } from '@infrastructure/repositories/ReportRepository';
import { ReportUseCases } from '@application/usecases/admin/reportUseCases';
import { ReportController } from '@presentation/controllers/admin/reportController';

import { CustomPackageRepository } from '@infrastructure/repositories/CustomPackageRepository';
import { CustomPackageUseCases } from '@application/usecases/admin/customPackageUseCases';
import { CustomPackageController } from '@presentation/controllers/admin/customPackageController';

import { DashboardRepository } from '@infrastructure/repositories/DashboardRepository';
import { DashboardUseCases } from '@application/usecases/admin/dashboardUseCases';
import { DashboardController } from '@presentation/controllers/admin/dashboardController';


import { ChatRoomRepository } from '@infrastructure/repositories/ChatRoomRepository';
import { ChatRoomUseCase } from '@application/usecases/chat/chatRoomUseCases';
import { ChatRoomController } from '@presentation/controllers/chat/ChatRoomController';

import { MessageRepository } from '@infrastructure/repositories/MessageRepository';
import { MessageUseCases } from '@application/usecases/chat/messageUseCases';
import { MessageController } from '@presentation/controllers/chat/MessageController';


import { NotificationUseCases } from '@application/usecases/notification/notificationUseCases';
import { NotificationRepository } from '@infrastructure/repositories/NotificationRepository';
import { NotificationController } from '@presentation/controllers/admin/notificationController';


const chatRoomRepository = new ChatRoomRepository();
const chatRoomUseCase = new ChatRoomUseCase(chatRoomRepository);
const chatRoomController = new ChatRoomController(chatRoomUseCase);

const messageRepository=new MessageRepository()
const messageUseCases=new MessageUseCases(messageRepository,chatRoomRepository)
const messageController=new MessageController(messageUseCases)


const adminRepository = new UserRepository();
const otpRepository = new OtpRepository();


const adminAuthUseCases = new AdminAuthUseCases(adminRepository, otpRepository);
const adminAuthController = new AdminAuthController(adminAuthUseCases);

const userManagementUseCases = new UserManagementUseCases(adminRepository);
const userManagementController = new UserManagementController(userManagementUseCases);


const bannerRepository = new BannerRepository();
const bannerMangementUseCases = new BannerMangementUseCases(bannerRepository);
const bannerMangementController = new BannerMangementController(bannerMangementUseCases);

const categoryRepository = new CategoryRepository();
const categoryUseCase = new CategoryUseCases(categoryRepository);
const categoryController = new CategoryController(categoryUseCase);

const packageRepository = new PackageRepository();
const packageUseCase = new PackageUseCases(packageRepository);
const packageController = new PackageController(packageUseCase);

const notificationRepository=new NotificationRepository()
const notificationUseCases=new NotificationUseCases(notificationRepository,adminRepository,packageRepository)
const notificationController=new NotificationController(notificationUseCases)

const couponRepository = new CouponRepository();
const couponUseCase = new CouponUseCases(couponRepository);
const couponController = new CouponController(couponUseCase);

const walletRepository=new WalletRepository()

const bookingRepository = new BookingRepository();
const bookingUseCase = new BookingUseCases(bookingRepository,walletRepository);
const bookingController = new BookingController(bookingUseCase);

const blogRepository = new BlogRepository();
const blogUseCases = new BlogUseCases(blogRepository);
const blogController = new BlogController(blogUseCases);

const reviewRepository = new ReviewRepository();
const reviewUseCases = new ReviewUseCases(reviewRepository);
const reviewController = new ReviewController(reviewUseCases);

const referralRepository = new ReferralRepository();
const referralUseCases = new ReferralUseCase(referralRepository);
const referralController = new ReferralController(referralUseCases);

const salesRepository = new SalesReportRepository();
const salesuseCases = new SalesReportUseCase(salesRepository);
const salesController = new SalesReportController(salesuseCases);

const reportRepository=new ReportRepository()
const reportUseCases=new ReportUseCases(reportRepository)
const reportController=new ReportController(reportUseCases)


const customPkgRepository = new CustomPackageRepository();
const customPkgUseCases = new CustomPackageUseCases(customPkgRepository);
const customPkgController = new CustomPackageController(customPkgUseCases);


const dashboardRepository = new DashboardRepository();
const dashboardUseCases = new DashboardUseCases(dashboardRepository);
const dashboardController = new DashboardController(dashboardUseCases);



const router = Router();

// AUTH ROUTES
router.post(AUTH_ROUTES.REFRESH_TOKEN, adminRefreshToken);
router.post(AUTH_ROUTES.LOGIN, adminAuthController.adminLogin);
router.post(AUTH_ROUTES.FORGOT_PASSWORD, adminAuthController.forgotPassword);
router.post(AUTH_ROUTES.FORGOT_PASSWORD_CHANGE, adminAuthController.forgotPasswordChange);
router.post(AUTH_ROUTES.LOGOUT, adminAuthController.adminLogout);

// USER MANAGEMENT
router.get(
  USER_MANAGEMENT_ROUTES.GET_ALL_USERS,
  adminAuthMiddleware,
  userManagementController.getAllUser
);
router.get(USER_MANAGEMENT_ROUTES.SEARCH_USERS,adminAuthMiddleware, userManagementController.searchAllUsersForAdmin);

router.get(
  USER_MANAGEMENT_ROUTES.GET_SINGLE_USER,
  adminAuthMiddleware,
  userManagementController.getSingleUser
);
router.patch(USER_MANAGEMENT_ROUTES.TOGGLE_BLOCK,adminAuthMiddleware, userManagementController.toggleBlockUser);



//  BANNER ROUTES
router.post(
  BANNER_ROUTES.ADD,
  adminAuthMiddleware,
  upload.single('image'),
  bannerMangementController.createBanner
);
router.get(BANNER_ROUTES.GET_ALL, adminAuthMiddleware, bannerMangementController.getBanner);
router.patch(BANNER_ROUTES.BLOCK, adminAuthMiddleware, bannerMangementController.blockBanner);
router.patch(BANNER_ROUTES.UNBLOCK, adminAuthMiddleware, bannerMangementController.unblockBanner);
router.delete(BANNER_ROUTES.DELETE, adminAuthMiddleware, bannerMangementController.deleteBanner);

// CATEGORY ROUTES
router.get(CATEGORY_ROUTES.GET_ALL, adminAuthMiddleware, categoryController.getAllCategories);
router.get(CATEGORY_ROUTES.GET_ACTIVE, categoryController.getActiveCategory);
router.get(CATEGORY_ROUTES.GET_BY_ID, adminAuthMiddleware, categoryController.getCategoryById);
router.post(CATEGORY_ROUTES.ADD, adminAuthMiddleware, categoryController.createCategory);
router.put(CATEGORY_ROUTES.EDIT, adminAuthMiddleware, categoryController.editCategory);
router.patch(CATEGORY_ROUTES.BLOCK, adminAuthMiddleware, categoryController.blockCategory);
router.patch(CATEGORY_ROUTES.UNBLOCK, adminAuthMiddleware, categoryController.unblockCategory);

// PACKAGE ROUTES
router.get(PACKAGE_ROUTES.GET_ALL, adminAuthMiddleware, packageController.getFullPackage);
router.get(PACKAGE_ROUTES.GET_BY_ID, adminAuthMiddleware, packageController.getPackagesById);
router.post(PACKAGE_ROUTES.ADD,adminAuthMiddleware,upload.array('images', 4),  packageController.createPackage
);
router.put(PACKAGE_ROUTES.EDIT,adminAuthMiddleware,upload.array('images', 4), packageController.editPackage);
router.patch(PACKAGE_ROUTES.BLOCK, adminAuthMiddleware, packageController.blockPackage);
router.patch(PACKAGE_ROUTES.UNBLOCK, adminAuthMiddleware, packageController.unblockPackage);

// COUPON ROUTES
router.get(COUPON_ROUTES.GET_ALL, adminAuthMiddleware, couponController.getAllCoupon);
router.post(COUPON_ROUTES.ADD, adminAuthMiddleware, couponController.createCoupon);
router.get(COUPON_ROUTES.GET_BY_ID, adminAuthMiddleware, couponController.getCouponById);
router.put(COUPON_ROUTES.EDIT, adminAuthMiddleware, couponController.editCoupon);
router.patch(COUPON_ROUTES.STATUS, adminAuthMiddleware, couponController.updateCouponStatus);
router.delete(COUPON_ROUTES.DELETE, adminAuthMiddleware, couponController.deleteCoupon);

// BOOKING ROUTES
router.get(BOOKING_ROUTES.GET_ALL, adminAuthMiddleware, bookingController.getAllBooking);
router.get(BOOKING_ROUTES.GET_BY_ID, adminAuthMiddleware, bookingController.getBookingByIdForAdmin);
router.patch(BOOKING_ROUTES.CANCEL, adminAuthMiddleware, bookingController.cancelBookingByAdmin);

// BLOG ROUTES
router.get(BLOG_ROUTES.GET_ALL, adminAuthMiddleware, blogController.getAllBlogs);
router.get(BLOG_ROUTES.GET_BY_ID, adminAuthMiddleware, blogController.getBlogById);
router.delete(BLOG_ROUTES.DELETE, adminAuthMiddleware, blogController.deleteBlog);
router.patch(BLOG_ROUTES.STATUS, adminAuthMiddleware, blogController.changeBlogStatus);

//REVIEW ROUTES

router.get(REVIEW_ROUTE.GET_REVIEWS, adminAuthMiddleware, reviewController.getAllReview);
router.get(REVIEW_ROUTE.GET_BY_ID, adminAuthMiddleware, reviewController.getReviewById);
router.patch(REVIEW_ROUTE.CHANGE_STATUS, adminAuthMiddleware, reviewController.changeReviewStatus);
router.delete(REVIEW_ROUTE.DELETE, adminAuthMiddleware, reviewController.deleteReview);

//REFERRAl ROUTES

router.get(REFERRAL_ROUTE.GET_REFERRAL, adminAuthMiddleware, referralController.getReferral);
router.post(
  REFERRAL_ROUTE.ADD_REFERRAL,
  adminAuthMiddleware,
  referralController.saveReferralSettings
);
router.get(REFERRAL_ROUTE.GET_BY_ID, adminAuthMiddleware, referralController.getReferralById);

//SALES REPORT ROUTES

router.get(SALES_REPORT_ROUTE.GET_SALES_REPORT, salesController.getReportList);
router.get(SALES_REPORT_ROUTE.SALES_REPORT_EXCEL_DOWNLOAD, salesController.downloadExcel);
router.get(SALES_REPORT_ROUTE.SALES_REPORT_PDF_DOWNLOAD, salesController.downloadPDF);

// 
//REPORT ROUTES
router.get(REPORT_ROUTE.GET_REPORT,adminAuthMiddleware,reportController.getAllReports)
router.get(REPORT_ROUTE.GET_REPORT_BY_ID,adminAuthMiddleware,reportController.getReportById)
 router.patch(REPORT_ROUTE.UPDATE_REPORT_STATUS,adminAuthMiddleware,reportController.updateReportStatus)


//CUSTOM PACAKGE ROUTES
router.get(CUSTOM_PACKAGE_ROUTE.GET_BY_ID, adminAuthMiddleware, customPkgController.getCustomPkgById);
router.get(CUSTOM_PACKAGE_ROUTE.GET_ALL_PKG, adminAuthMiddleware, customPkgController.getAllCustomPkgs);
router.put(CUSTOM_PACKAGE_ROUTE.CHANGE_STATUS, adminAuthMiddleware, customPkgController.changeCustomPkgStatus);
router.delete(CUSTOM_PACKAGE_ROUTE.DELETE, adminAuthMiddleware,customPkgController.deleteCustomPkg);

// // DASHBOARD ROUTES
router.get(DASHBOARD_ROUTE.GET_DASHBOARD_SUMMARY, adminAuthMiddleware, dashboardController.getDashboardSummary);
router.get(DASHBOARD_ROUTE.GET_TOP_PACKAGES, adminAuthMiddleware, dashboardController.getTopBookedPackages);
router.get(DASHBOARD_ROUTE.GET_TOP_CATEGORIES, adminAuthMiddleware, dashboardController.getTopBookedCategories);
router.get(DASHBOARD_ROUTE.GET_BOOKING_CHART, adminAuthMiddleware, dashboardController.getBookingChart);


//CHAT ROOM ROUTES
 router.post(CHAT_ROOM_ROUTE.CREATE, adminAuthMiddleware, chatRoomController.createRoom);
router.put(CHAT_ROOM_ROUTE.UPDATE, adminAuthMiddleware, chatRoomController.updateRoom);
router.get(CHAT_ROOM_ROUTE.GET_BY_ID, adminAuthMiddleware, chatRoomController.getRoomById);
router.get(CHAT_ROOM_ROUTE.GET_USER_ROOMS, adminAuthMiddleware, chatRoomController.getUserRooms);
router.delete(CHAT_ROOM_ROUTE.DELETE, adminAuthMiddleware,chatRoomController.deleteRoom);

//MESSAGE ROUTES
// router.post(MESSAGE_ROUTE.SEND, adminAuthMiddleware, messageController.sendMessage);
 router.get(MESSAGE_ROUTE.GET_BY_ROOM, adminAuthMiddleware, messageController.getMessages);
 router.post(MESSAGE_ROUTE.UPLOAD_MEDIA, adminAuthMiddleware,chatUpload.single('file'), messageController.uploadMediaToChat);
//router.patch(MESSAGE_ROUTE.MARK_AS_READ, adminAuthMiddleware, messageController.markMessageRead);
 //router.delete(MESSAGE_ROUTE.DELETE, adminAuthMiddleware,messageController.deleteMessage);


 router.get(NOTIFICATION_ROUTE.FETCH_NOTIFICATION,adminAuthMiddleware,notificationController.getNotifications)
 router.patch(NOTIFICATION_ROUTE.MARK_AS_READ,adminAuthMiddleware,notificationController.markAsRead)
 
 

 export default router;
