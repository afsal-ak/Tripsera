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
 


const router=Router()

//admin router
router.post('/refresh-token',refreshToken)
router.post('/admin-login',adminAuthController.adminLogin)
router.post('/forgotPassword',adminAuthController.forgotPassword)
router.post('/forgotPasswordChange',adminAuthController.forgotPasswordChange)
router.post('/logout',adminAuthController.adminLogout)

//user router
router.get('/users',userManagementController.getAllUser)
router.get('/users/:userId', userManagementController.getSingleUser);
router.patch('/users/:userId/block', userManagementController.blockUser);
router.patch('/users/:userId/unblock', userManagementController.unblockUser)

//banner router

router.post('/banner',upload.single('image'),bannerMangementController.createBanner)
router.get('/getBanner',bannerMangementController.getBanner)
router.delete('/banner/:bannerId/delete',bannerMangementController.deleteBanner)

//category router

router.get("/category", categoryController.getAllCategories);
router.post("/addCategory", categoryController.createCategory);
router.put("/category/:id", categoryController.editCategory);
router.patch("/category/:id/block", categoryController.blockCategory);
router.patch("/category/:id/unblock", categoryController.unblockCategory);

//package router 
router.get('/packages',adminAuthMiddleware,packageController.getFullPackage)
router.get('/packages/:id',packageController.getPackagesById)
router.post('/addPackage',upload.array('images',2),packageController.createPackage)
router.put('/packages/:id/edit',upload.array('images',2),packageController.editPackage)
router.patch('/packages/:id/block',packageController.blockPackage)
router.patch('/packages/:id/unblock',packageController.unblockPackage)
router.patch('/packages/:id/delete',packageController.deletePackage)




export default router;