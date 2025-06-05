import { Router } from "express";
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

 


const router=Router()

//admin auth
router.post('/refresh-token',refreshToken)
router.post('/admin-login',adminAuthController.adminLogin)
router.post('/forgotPassword',adminAuthController.forgotPassword)
router.post('/forgotPasswordChange',adminAuthController.forgotPasswordChange)

//user management
router.get('/users',userManagementController.getAllUser)
router.get('/users/:userId', userManagementController.getSingleUser);
router.patch('/users/:userId/block', userManagementController.blockUser);
router.patch('/users/:userId/unblock', userManagementController.unblockUser)

//banner mnagement

router.post('/banner',upload.single('image'),bannerMangementController.createBanner)
router.get('/getBanner',bannerMangementController.getBanner)
router.delete('/banner/:bannerId/delete',bannerMangementController.deleteBanner)

//category mangement

router.get("/category", (req, res) => categoryController.getAllCategories(req, res));
router.post("/addCategory", (req, res) => categoryController.createCategory(req, res));
router.put("/category/:id", (req, res) => categoryController.editCategory(req, res));
router.patch("/category/:id/block", (req, res) => categoryController.blockCategory(req, res));
router.patch("/category/:id/unblock", (req, res) => categoryController.unblockCategory(req, res));

 

export default router;