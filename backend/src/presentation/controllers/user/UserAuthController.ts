import { Request, Response } from "express";
import { UserAuthUsecases } from "@domain/usecases/user/userAuthUseCases";


export class UserAuthController {
  constructor(
    private userAuthUseCases: UserAuthUsecases
  ) {}

  preRegister = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, username ,password} = req.body;
    

      console.log(req.body,'body')
      await this.userAuthUseCases.preRegistration({email, username,password});
      res.status(200).json({ message: "OTP send to your email" });
    } catch (error: any) {
      console.log(error.message)
      res.status(400).json({ message: error.message });

    }
  };

  // register = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { email, username, password, otp } = req.body;
  //     const userData: IUser = { email, username, password };
  //           console.log(req.body,'body')

  //     await this.userAuthUseCases.verifyOtpAndRegister(userData, otp);
  //     res.status(200).json({ message: 'User registered successfully' });
  //   } catch (error: any) {
  //     res.status(400).json({ message: error.message });
  //   }
  // };

  register=async(req:Request,res:Response):Promise<void> =>{
    try {
      const {email,otp}=req.body
      console.log(req.body,'register')
      await this.userAuthUseCases.verifyOtpAndRegister(email,otp)
      res.status(200).json({ message: "User registered successfully" });

    } catch (error:any) {
      console.log(error.message)
      res.status(400).json({ message: error.message });

    }
  }

resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await this.userAuthUseCases.resendOtp(email);
    res.status(200).json({ message: 'OTP resent to your email' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.userAuthUseCases.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
   
      res.status(200).json({
        message: 'Login successful',
        user,
        accessToken,
       refreshToken
      });
    } catch (error: any) {
      console.log(error.message,'login')
      res.status(401).json({ message: error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      console.log({email})
      await this.userAuthUseCases.forgotPasswordOtp(email);
      res.status(200).json({ message: "OTP send to your email" });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  verifyOtpForForgotPassword=async(req:Request,res:Response):Promise<void>=>{
  try {
    const {email,otp}=req.body
      console.log(req.body,'otp')
    const {token}=await this.userAuthUseCases.verifyOtpForForgotPassword(email,otp)
   console.log(token,'contr')
    res.status(200).json({message:"OTP Verfied Successfully",token})
  } catch (error:any) {
    res.status(400).json({message:error.message})
  }
}

  forgotPasswordChange = async (req: Request, res: Response): Promise<void> => {
    try {
      const {  token, password, } = req.body;
       console.log(req.body);
      await this.userAuthUseCases.forgotPasswordChange(token, password);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  googleLogin=async(req:Request,res:Response):Promise<void>=>{
    const {token}=req.body
      if(!token){
        res.status(400).json({message:"Missing Google token"})
      }
    try {
    const data=await this.userAuthUseCases.loginWithGoole(token)
    res.status(200).json(data)
    } catch (error:any) {
      console.log(error)
      res.status(500).json({ message: error.message || "Google login failed" });
   
    }
  }

  
  userLogout=async(req:Request,res:Response):Promise<void>=>{
  try {
     res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.status(200).json({ message: "Admin logout successful" });
  } catch (error:any) {
    res.status(401).json({message:error.message})
  }
}
}
