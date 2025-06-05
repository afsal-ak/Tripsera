import { Router } from "express";
import { UserAuthUsecases } from "@domain/usecases/user/userAuthUseCases";
import { MongoUserRepository } from "@infrastructure/repositories/MongoUserRepository";
import { MongoOtpRepository } from "@infrastructure/repositories/MongoOtpRepository";
import { UserAuthController } from "@presentation/controllers/user/UserAuthController";
import { refreshToken } from "@presentation/controllers/token/refreshToken";

const userRepository=new MongoUserRepository();
const otpRepository=new MongoOtpRepository();
const userAuthUseCases=new UserAuthUsecases(userRepository,otpRepository)
const userAuthController=new UserAuthController(userAuthUseCases)

const router=Router()
router.post('refresh-token',refreshToken)
router.post('/pre-register',(req,res)=>userAuthController.preRegister(req,res))
router.post('/register', (req, res) => userAuthController.register(req, res));
router.post('/login', (req, res) => userAuthController.login(req, res));
router.post('/forgotPassword',(req,res)=>userAuthController.forgotPassword(req,res))
router.post('/forgotPasswordChange',(req,res)=>userAuthController.forgotPasswordChange(req,res))

export default router;