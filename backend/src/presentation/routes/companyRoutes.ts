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
  NOTIFICATION_ROUTE,
} from 'constants/route-constants/companyRoutes';

import { companyAuthMiddleware } from '@presentation/middlewares/companyAuthMiddleware';
import { CompanyAuthUseCases } from '@application/usecases/company/companyAuthUseCases';
import { CompanyAuthController } from '@presentation/controllers/company/CompanyAuthController';

import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { OtpRepository } from '@infrastructure/repositories/OtpRepository';
import { UserManagementUseCases } from '@application/usecases/admin/userManagementUseCases';
import { UserManagementController } from '@presentation/controllers/admin/userMangementController';

import { CompanyRepository } from '@infrastructure/repositories/CompanyRepository';
import { CompanyUseCases } from '@application/usecases/company/CompanyUseCases';
import { CompanyController } from '@presentation/controllers/company/CompanyController';

import { upload } from '@presentation/middlewares/upload';
import { chatUpload } from '@presentation/middlewares/chatUpload';

import { PackageUseCases } from '@application/usecases/company/packageUseCases';
import { PackageController } from '@presentation/controllers/company/packageController';
import { PackageRepository } from '@infrastructure/repositories/PackageRepository';



import { BookingUseCases } from '@application/usecases/company/bookingUseCases';
import { BookingRepository } from '@infrastructure/repositories/BookingRepository';
import { BookingController } from '@presentation/controllers/company/bookingController';



import { SalesReportRepository } from '@infrastructure/repositories/salesReportRepository';
import { SalesReportUseCase } from '@application/usecases/company/salesReportUseCase';
import { SalesReportController } from '@presentation/controllers/company/salesReportController';





import { ReviewRepository } from '@infrastructure/repositories/ReviewRepository';
import { ReviewUseCases } from '@application/usecases/company/reviewUseCase';
import { ReviewController } from '@presentation/controllers/company/reviewController';

import { ReportRepository } from '@infrastructure/repositories/ReportRepository';
import { ReportUseCases } from '@application/usecases/admin/reportUseCases';
import { ReportController } from '@presentation/controllers/admin/reportController';

import { CustomPackageRepository } from '@infrastructure/repositories/CustomPackageRepository';
import { CustomPackageUseCases } from '@application/usecases/company/customPackageUseCases';
import { CustomPackageController } from '@presentation/controllers/company/customPackageController';

import { DashboardRepository } from '@infrastructure/repositories/DashboardRepository';
import { DashboardUseCases } from '@application/usecases/company/dashboardUseCases';
import { DashboardController } from '@presentation/controllers/company/dashboardController';

import { ChatRoomRepository } from '@infrastructure/repositories/ChatRoomRepository';
import { ChatRoomUseCase } from '@application/usecases/chat/chatRoomUseCases';
import { ChatRoomController } from '@presentation/controllers/company/ChatRoomController';

import { MessageRepository } from '@infrastructure/repositories/MessageRepository';
import { MessageUseCases } from '@application/usecases/chat/messageUseCases';
import { MessageController } from '@presentation/controllers/chat/MessageController';

import { NotificationUseCases } from '@application/usecases/notification/notificationUseCases';
import { NotificationRepository } from '@infrastructure/repositories/NotificationRepository';
import { NotificationController } from '@presentation/controllers/company/notificationController';
import { WalletRepository } from '@infrastructure/repositories/WalletRepository ';


const userRepository = new UserRepository();
const otpRepository = new OtpRepository();


const userManagementUseCases = new UserManagementUseCases(userRepository);
const userManagementController = new UserManagementController(userManagementUseCases);

const chatRoomRepository = new ChatRoomRepository();
const chatRoomUseCase = new ChatRoomUseCase(chatRoomRepository,userRepository);
const chatRoomController = new ChatRoomController(chatRoomUseCase);

const messageRepository = new MessageRepository();
const messageUseCases = new MessageUseCases(messageRepository, chatRoomRepository);
const messageController = new MessageController(messageUseCases);


const packageRepository = new PackageRepository();
const packageUseCase = new PackageUseCases(packageRepository);
const packageController = new PackageController(packageUseCase);

const notificationRepository = new NotificationRepository();
const notificationUseCases = new NotificationUseCases(notificationRepository, userRepository);
const notificationController = new NotificationController(notificationUseCases);

const walletRepository = new WalletRepository();

const bookingRepository = new BookingRepository();
const bookingUseCase = new BookingUseCases(
  bookingRepository,
  walletRepository,
  packageRepository,
  notificationUseCases
);
const bookingController = new BookingController(bookingUseCase);

const reviewRepository = new ReviewRepository();
const reviewUseCases = new ReviewUseCases(reviewRepository);
const reviewController = new ReviewController(reviewUseCases);

const salesRepository = new SalesReportRepository();
const salesuseCases = new SalesReportUseCase(salesRepository);
const salesController = new SalesReportController(salesuseCases);

const reportRepository = new ReportRepository();
const reportUseCases = new ReportUseCases(reportRepository);
const reportController = new ReportController(reportUseCases);

const customPkgRepository = new CustomPackageRepository();
const customPkgUseCases = new CustomPackageUseCases(customPkgRepository, packageRepository, notificationUseCases);
const customPkgController = new CustomPackageController(customPkgUseCases);

const dashboardRepository = new DashboardRepository();
const dashboardUseCases = new DashboardUseCases(dashboardRepository);
const dashboardController = new DashboardController(dashboardUseCases);





import { userRefreshToken } from '@presentation/controllers/token/userRefreshToken';
import { ReferralRepository } from '@infrastructure/repositories/ReferralRepository';



const referralRepository = new ReferralRepository();

// const userRepository = new UserRepository();
const companyAuthUseCases = new CompanyAuthUseCases(
  userRepository,
  otpRepository,
  walletRepository,
  referralRepository
);
const companyAuthController = new CompanyAuthController(companyAuthUseCases);

const companyRepo=new CompanyRepository()
const companyUseCases=new CompanyUseCases(companyRepo,userRepository)
const companyController=new CompanyController(companyUseCases)

const router = Router();


// AUTH ROUTES
router.post(AUTH_ROUTES.REFRESH_TOKEN, userRefreshToken);
router.post(AUTH_ROUTES.PRE_REGISTER, companyAuthController.preRegister);
router.post(AUTH_ROUTES.REGISTER, companyAuthController.register);
router.post(AUTH_ROUTES.RESEND_OTP, companyAuthController.resendOtp);
router.post(AUTH_ROUTES.LOGIN, companyAuthController.login);
router.post(AUTH_ROUTES.GOOGLE_LOGIN, companyAuthController.googleLogin);
router.post(AUTH_ROUTES.FORGOT_PASSWORD, companyAuthController.forgotPassword);
router.post(AUTH_ROUTES.VERIFY_OTP, companyAuthController.verifyOtpForForgotPassword);
router.post(AUTH_ROUTES.FORGOT_PASSWORD_CHANGE, companyAuthController.forgotPasswordChange);
router.post(AUTH_ROUTES.LOGOUT, companyAuthController.userLogout);

router.post(
  AUTH_ROUTES.EMAIL_REQUEST_CHANGE,
  // userAuthMiddleware,
  companyAuthController.requestEmailChange
);
router.post(
  AUTH_ROUTES.EMAIL_VERIFY_CHANGE,
  // userAuthMiddleware,

  companyAuthController.verifyAndUpdateEmail
);
router.post(AUTH_ROUTES.PASSWORD_CHANGE,
    companyAuthMiddleware,
  companyAuthController.changePassword);



router.get(
  "/company-profile",
  companyAuthMiddleware,
  companyController.getCompanyProfile
)


router.get(
  "/setup-data",
  companyAuthMiddleware,
  companyController.getSetupData
)
router.post(
  "/setup",
  companyAuthMiddleware,
  upload.single("logo"),
  companyController.setupCompany
)

router.put(
  "/update",
  companyAuthMiddleware,
  companyController.updateCompany
);

router.put(
  "/logo",
  companyAuthMiddleware,
  upload.single("logo"),
  companyController.updateCompanyLogo
);




// router.put(
//   "/company/update",
//   companyAuthMiddleware,
//   companyController.updateCompany
// )

// PACKAGE ROUTES
router.get(PACKAGE_ROUTES.GET_ALL, companyAuthMiddleware, packageController.getFullPackage);
router.get(PACKAGE_ROUTES.GET_BY_ID, companyAuthMiddleware, packageController.getPackagesById);
router.post(
  PACKAGE_ROUTES.ADD,
  companyAuthMiddleware,
  upload.array('images', 4),
  packageController.createPackage
);
router.put(
  PACKAGE_ROUTES.EDIT,
  companyAuthMiddleware,
  upload.array('images', 4),
  packageController.editPackage
);
router.patch(PACKAGE_ROUTES.BLOCK, companyAuthMiddleware, packageController.blockPackage);
router.patch(PACKAGE_ROUTES.UNBLOCK, companyAuthMiddleware, packageController.unblockPackage);


router.put(
  BOOKING_ROUTES.CHANGE_TRAVEL_DATE,
  companyAuthMiddleware,
  bookingController.changeTravelDate
);

// BOOKING ROUTES
router.get(BOOKING_ROUTES.GET_ALL, companyAuthMiddleware, bookingController.getAllCompanyBookings);
router.get(BOOKING_ROUTES.GET_BY_ID, companyAuthMiddleware, bookingController.getBookingByIdForAdmin);
router.put(BOOKING_ROUTES.CONFIRM, companyAuthMiddleware, bookingController.confirmBookingByAdmin);
router.patch(BOOKING_ROUTES.CANCEL, companyAuthMiddleware, bookingController.cancelBookingByAdmin);


//SALES REPORT ROUTES

router.get(SALES_REPORT_ROUTE.GET_SALES_REPORT,companyAuthMiddleware, salesController.getCompanyReportList);
router.get(SALES_REPORT_ROUTE.SALES_REPORT_EXCEL_DOWNLOAD,companyAuthMiddleware, salesController.downloadExcel);
router.get(SALES_REPORT_ROUTE.SALES_REPORT_PDF_DOWNLOAD,companyAuthMiddleware, salesController.downloadPDF);


// // DASHBOARD ROUTES
router.get(
  DASHBOARD_ROUTE.GET_DASHBOARD_SUMMARY,
  companyAuthMiddleware,
  dashboardController.getDashboardSummary
);
router.get(
  DASHBOARD_ROUTE.GET_TOP_PACKAGES,
  companyAuthMiddleware,
  dashboardController.getTopBookedPackages
);
router.get(
  DASHBOARD_ROUTE.GET_TOP_CATEGORIES,
  companyAuthMiddleware,
  dashboardController.getTopBookedCategories
);
router.get(
  DASHBOARD_ROUTE.GET_BOOKING_CHART,
  companyAuthMiddleware,
  dashboardController.getBookingChart
);


//REVIEW ROUTES

router.get(REVIEW_ROUTE.GET_REVIEWS, companyAuthMiddleware, reviewController.getAllReview);
router.get(REVIEW_ROUTE.GET_BY_ID, companyAuthMiddleware, reviewController.getReviewById);


//Notification Routes
router.get(
  NOTIFICATION_ROUTE.FETCH_NOTIFICATION,
  companyAuthMiddleware,
  notificationController.getNotifications
);
router.patch(
  NOTIFICATION_ROUTE.MARK_AS_READ,
  companyAuthMiddleware,
  notificationController.markAsRead
);



//CHAT ROOM ROUTES
router.post(CHAT_ROOM_ROUTE.CREATE, companyAuthMiddleware, chatRoomController.createRoom);
router.put(CHAT_ROOM_ROUTE.UPDATE, companyAuthMiddleware, chatRoomController.updateRoom);
router.get(CHAT_ROOM_ROUTE.GET_BY_ID, companyAuthMiddleware, chatRoomController.getRoomById);
router.get(CHAT_ROOM_ROUTE.TOATAL_UNREAD_COUNT, companyAuthMiddleware, chatRoomController.totalChatUnread);

router.get(CHAT_ROOM_ROUTE.GET_USER_ROOMS, companyAuthMiddleware, chatRoomController.getUserRooms);
router.delete(CHAT_ROOM_ROUTE.DELETE, companyAuthMiddleware, chatRoomController.deleteRoom);

router.get(
  USER_MANAGEMENT_ROUTES.SEARCH_USERS,
  companyAuthMiddleware,
  chatRoomController.searchAllUsersForCompany
);

//MESSAGE ROUTES
router.get(MESSAGE_ROUTE.GET_BY_ROOM, companyAuthMiddleware, messageController.getMessages);
router.post(
  MESSAGE_ROUTE.UPLOAD_MEDIA,
  companyAuthMiddleware,
  chatUpload.single('file'),
  messageController.uploadMediaToChat
);

router.get(
  NOTIFICATION_ROUTE.FETCH_NOTIFICATION,
  companyAuthMiddleware,
  notificationController.getNotifications
);
router.patch(
  NOTIFICATION_ROUTE.MARK_AS_READ,
  companyAuthMiddleware,
  notificationController.markAsRead
);

// //
// //REPORT ROUTES
// router.get(REPORT_ROUTE.GET_REPORT, adminAuthMiddleware, reportController.getAllReports);
// router.get(REPORT_ROUTE.GET_REPORT_BY_ID, adminAuthMiddleware, reportController.getReportById);
// router.patch(
//   REPORT_ROUTE.UPDATE_REPORT_STATUS,
//   adminAuthMiddleware,
//   reportController.updateReportStatus
// );

//CUSTOM PACAKGE ROUTES
router.get(
  CUSTOM_PACKAGE_ROUTE.GET_ALL_REQUESTED_PKG,
  companyAuthMiddleware,
  customPkgController.getAllRequestedCustomPkgs
);
router.get(
  CUSTOM_PACKAGE_ROUTE.GET_ALL_APPROVED_PKG,
  companyAuthMiddleware,
  customPkgController.getAllApprovedCustomPkgs
);

router.get(
  CUSTOM_PACKAGE_ROUTE.GET_BY_ID,
  companyAuthMiddleware,
  customPkgController.getCustomPkgById
);

router.post(CUSTOM_PACKAGE_ROUTE.CREATE,companyAuthMiddleware,upload.array('images', 4),customPkgController.createCustomPackage)
router.put(CUSTOM_PACKAGE_ROUTE.UPDATE,companyAuthMiddleware,upload.array('images', 4),customPkgController.editCustomPackage)

router.put(CUSTOM_PACKAGE_ROUTE.CHANGE_STATUS,companyAuthMiddleware,customPkgController.changeCustomPkgStatus);
router.delete(  CUSTOM_PACKAGE_ROUTE.DELETE, companyAuthMiddleware,customPkgController.deleteCustomPkg);




export default router;
