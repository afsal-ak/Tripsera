import { Request,Response,NextFunction } from "express";
import { WalletUseCases } from "@domain/usecases/user/walletUseCases";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";

export class WalletController{
    constructor(private walletUseCases:WalletUseCases){}

    // createWallet=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    //     try {
            
    //     } catch (error) {
    //         next(next)
    //     }
    // }

    getUserWallet=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try {
            const userId=getUserIdFromRequest(req)
            const page=parseInt(req.query.page as string)||1
            const limit=parseInt(req.query.limit as string)||9
              const sort = req.query.sort === "oldest" ? "oldest" : "newest";

       //     console.log(req.query,'from wallet')
          
            const {balance,transactions,total}=await this.walletUseCases.getUserWallet(userId, { page, limit, sort })

            res.status(200).json({
                balance,
                transactions,
                total,
                message:'wallet fetched successfully'
            })

        } catch (error) {
            next(error)
        }
    }

   creditWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const { amount, description }: { amount: number; description: string } = req.body;

      if (typeof amount !== "number" || amount <= 0) {
         res.status(400).json({ message: "Invalid amount" });
         return
      }

      const wallet = await this.walletUseCases.creditWallet(userId, amount, description);
      res.status(200).json({
        wallet,
        message: "Wallet credited successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  debitWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const { amount, description }: { amount: number; description: string } = req.body;

      if (typeof amount !== "number" || amount <= 0) {
         res.status(400).json({ message: "Invalid amount" });
         return
      }

      const wallet = await this.walletUseCases.debitWallet(userId, amount, description);
      res.status(200).json({
        wallet,
        message: "Wallet debited successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}