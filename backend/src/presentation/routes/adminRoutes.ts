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
} from 'constants/route-constants/adminRoutes';

import { adminAuthMiddleware } from '@presentation/middlewares/adminAuthMiddleware';
import { AdminAuthUseCases } from '@domain/usecases/admin/adminAuthUseCases';
import { AdminAuthController } from '@presentation/controllers/admin/adminAuthController';
import { MongoUserRepository } from '@infrastructure/repositories/MongoUserRepository';
import { MongoOtpRepository } from '@infrastructure/repositories/MongoOtpRepository';
import { adminRefreshToken } from '@presentation/controllers/token/adminRefreshToken';
import { UserManagementUseCases } from '@domain/usecases/admin/userManagementUseCases';
import { UserManagementController } from '@presentation/controllers/admin/userMangementController';

import { upload } from '@presentation/middlewares/upload';
import { BannerMangementController } from '@presentation/controllers/admin/bannerController';
import { BannerMangementUseCases } from '@domain/usecases/admin/bannerUseCases';
import { MongoBannerRepository } from '@infrastructure/repositories/MongoBannerRepository';

import { CategoryUseCases } from '@domain/usecases/admin/categoryUseCases';
import { CategoryController } from '@presentation/controllers/admin/categoryController';
import { MongoCategoryRepository } from '@infrastructure/repositories/MongoCategoryRepository';

import { PackageUseCases } from '@domain/usecases/admin/packageUseCases';
import { PackageController } from '@presentation/controllers/admin/packageController';
import { MongoPackageRepository } from '@infrastructure/repositories/MongoPackageRepository';

import { CouponUseCases } from '@domain/usecases/admin/couponUseCases';
import { MongoCouponRepository } from '@infrastructure/repositories/MongoCouponRepository';
import { CouponController } from '@presentation/controllers/admin/couponController';

import { BookingUseCases } from '@domain/usecases/admin/bookingUseCases';
import { MongoBookingRepository } from '@infrastructure/repositories/MongoBookingRepository';
import { BookingController } from '@presentation/controllers/admin/bookingController';

import { MongoBlogRepository } from '@infrastructure/repositories/MongoBlogRepository';
import { BlogUseCases } from '@domain/usecases/admin/blogUseCases';
import { BlogController } from '@presentation/controllers/admin/blogController';

const adminRepository = new MongoUserRepository();
const otpRepository = new MongoOtpRepository();

const adminAuthUseCases = new AdminAuthUseCases(adminRepository, otpRepository);
const adminAuthController = new AdminAuthController(adminAuthUseCases);

const userManagementUseCases = new UserManagementUseCases(adminRepository);
const userManagementController = new UserManagementController(userManagementUseCases);

const bannerRepository = new MongoBannerRepository();
const bannerMangementUseCases = new BannerMangementUseCases(bannerRepository);
const bannerMangementController = new BannerMangementController(bannerMangementUseCases);

const categoryRepository = new MongoCategoryRepository();
const categoryUseCase = new CategoryUseCases(categoryRepository);
const categoryController = new CategoryController(categoryUseCase);

const packageRepository = new MongoPackageRepository();
const packageUseCase = new PackageUseCases(packageRepository);
const packageController = new PackageController(packageUseCase);

const couponRepository = new MongoCouponRepository();
const couponUseCase = new CouponUseCases(couponRepository);
const couponController = new CouponController(couponUseCase);

const bookingRepository = new MongoBookingRepository();
const bookingUseCase = new BookingUseCases(bookingRepository);
const bookingController = new BookingController(bookingUseCase);

const blogRepository = new MongoBlogRepository();
const blogUseCases = new BlogUseCases(blogRepository);
const blogController = new BlogController(blogUseCases);

const router = Router();

// AUTH ROUTES 
router.post(AUTH_ROUTES.REFRESH_TOKEN, adminRefreshToken);
router.post(AUTH_ROUTES.LOGIN, adminAuthController.adminLogin);
router.post(AUTH_ROUTES.FORGOT_PASSWORD, adminAuthController.forgotPassword);
router.post(AUTH_ROUTES.FORGOT_PASSWORD_CHANGE, adminAuthController.forgotPasswordChange);
router.post(AUTH_ROUTES.LOGOUT, adminAuthController.adminLogout);

// USER MANAGEMENT 
router.get(USER_MANAGEMENT_ROUTES.GET_ALL_USERS, adminAuthMiddleware, userManagementController.getAllUser);
router.get(USER_MANAGEMENT_ROUTES.GET_SINGLE_USER, adminAuthMiddleware, userManagementController.getSingleUser);
router.patch(USER_MANAGEMENT_ROUTES.BLOCK_USER, adminAuthMiddleware, userManagementController.blockUser);
router.patch(USER_MANAGEMENT_ROUTES.UNBLOCK_USER, adminAuthMiddleware, userManagementController.unblockUser);

//  BANNER ROUTES
router.post(BANNER_ROUTES.ADD, adminAuthMiddleware, upload.single('image'), bannerMangementController.createBanner);
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
router.post(PACKAGE_ROUTES.ADD, adminAuthMiddleware, upload.array('images', 4), packageController.createPackage);
router.put(PACKAGE_ROUTES.EDIT, adminAuthMiddleware, upload.array('images', 4), packageController.editPackage);
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

export default router;
