import { Router } from "express";
import { adminAuthMiddleware } from "@presentation/middlewares/adminAuthMiddleware";
import { AdminAuthUseCases } from "@domain/usecases/admin/adminAuthUseCases";
import { AdminAuthController } from "@presentation/controllers/admin/adminAuthController";
import { MongoUserRepository } from "@infrastructure/repositories/MongoUserRepository";
import { MongoOtpRepository } from "@infrastructure/repositories/MongoOtpRepository";
import { refreshToken } from "@presentation/controllers/token/refreshToken";
import { UserManagementUseCases } from "@domain/usecases/admin/userManagementUseCases";
import { UserManagementController } from "@presentation/controllers/admin/userMangementController";

import { upload } from "@presentation/middlewares/upload";
import { BannerMangementController } from "@presentation/controllers/admin/bannerController";
import { BannerMangementUseCases } from "@domain/usecases/admin/bannerUseCases";
import { MongoBannerRepository } from "@infrastructure/repositories/MongoBannerRepository";

import { CategoryUseCases } from "@domain/usecases/admin/categoryUseCases";
import { CategoryController } from "@presentation/controllers/admin/categoryController"; 
import { MongoCategoryRepository } from "@infrastructure/repositories/MongoCategoryRepository";

import { PackageUseCases } from "@domain/usecases/admin/packageUseCases";
import { PackageController } from "@presentation/controllers/admin/packageController";
import { MongoPackageRepository } from "@infrastructure/repositories/MongoPackageRepository";

import { CouponUseCases } from "@domain/usecases/admin/couponUseCases";
import { MongoCouponRepository } from "@infrastructure/repositories/MongoCouponRepository";
import { CouponController } from "@presentation/controllers/admin/couponController";




const adminRepository=new MongoUserRepository();
const otpRepository=new MongoOtpRepository();

const adminAuthUseCases=new AdminAuthUseCases(adminRepository,otpRepository)
const adminAuthController=new AdminAuthController(adminAuthUseCases)

const userManagementUseCases=new UserManagementUseCases(adminRepository)
const userManagementController=new UserManagementController(userManagementUseCases)

const bannerRepository=new MongoBannerRepository()
const bannerMangementUseCases=new BannerMangementUseCases(bannerRepository)
const bannerMangementController=new BannerMangementController(bannerMangementUseCases)

const categoryRepository = new MongoCategoryRepository();
const categoryUseCase = new CategoryUseCases(categoryRepository);
const categoryController = new CategoryController(categoryUseCase);

const packageRepository=new MongoPackageRepository()
const packageUseCase=new PackageUseCases(packageRepository)
const packageController=new PackageController(packageUseCase)

const couponRepository=new MongoCouponRepository()
const couponUseCase=new CouponUseCases(couponRepository)
const couponController=new CouponController(couponUseCase)


const router=Router()

//admin router
router.post('/refresh-token',refreshToken)
router.post('/admin-login',adminAuthController.adminLogin)
router.post('/forgotPassword',adminAuthController.forgotPassword)
router.post('/forgotPasswordChange',adminAuthController.forgotPasswordChange)
router.post('/logout',adminAuthController.adminLogout)

//user router
router.get('/users',adminAuthMiddleware,userManagementController.getAllUser)
router.get('/users/:userId',adminAuthMiddleware, userManagementController.getSingleUser);
router.patch('/users/:userId/block',adminAuthMiddleware, userManagementController.blockUser);
router.patch('/users/:userId/unblock',adminAuthMiddleware, userManagementController.unblockUser)

//banner router

router.post('/addBanner',adminAuthMiddleware,upload.single('image'),bannerMangementController.createBanner)
router.get('/banners',adminAuthMiddleware,bannerMangementController.getBanner)
router.patch('/banners/:bannerId/unblock',adminAuthMiddleware,bannerMangementController.unblockBanner)
router.patch('/banners/:bannerId/block',adminAuthMiddleware,bannerMangementController.blockBanner)
router.delete('/banners/:bannerId/delete',adminAuthMiddleware,bannerMangementController.deleteBanner)

//category router

router.get("/categories",adminAuthMiddleware, categoryController.getAllCategories);
router.get("/category/active", categoryController.getActiveCategory);
router.get("/category/:id",adminAuthMiddleware, categoryController.getCategoryById);
router.post("/addCategory",adminAuthMiddleware, categoryController.createCategory);
router.put("/category/:id",adminAuthMiddleware, categoryController.editCategory);
router.patch("/category/:id/block", adminAuthMiddleware,categoryController.blockCategory);
router.patch("/category/:id/unblock",adminAuthMiddleware, categoryController.unblockCategory);

//package router 
router.get('/packages',adminAuthMiddleware,packageController.getFullPackage)
router.get('/packages/:id',adminAuthMiddleware,packageController.getPackagesById)
router.post('/addPackage',adminAuthMiddleware,upload.array('images',4),packageController.createPackage)
router.put('/packages/:id/edit',adminAuthMiddleware,upload.array('images',4),packageController.editPackage)
router.patch('/packages/:id/block',adminAuthMiddleware,packageController.blockPackage)
router.patch('/packages/:id/unblock',adminAuthMiddleware,packageController.unblockPackage)
//router.patch('/packages/:id/delete',adminAuthMiddleware,packageController.deletePackage)

//coupon router

router.get('/coupons',adminAuthMiddleware,couponController.getAllCoupon)
router.post('/coupon/add',adminAuthMiddleware,couponController.createCoupon)
router.get('/coupon/:id',adminAuthMiddleware,couponController.getCouponById)
router.put('/coupon/edit/:id',adminAuthMiddleware,couponController.editCoupon)
router.patch('/coupon/status/:id',adminAuthMiddleware,couponController.updateCouponStatus)
router.delete('/coupon/delete/:id',adminAuthMiddleware,couponController.deleteCoupon)
export default router;