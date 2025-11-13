import { Request, Response, NextFunction } from "express";
import { INewsLetterSubscribeUseCases } from "@application/useCaseInterfaces/user/INewsLetterSubscribeUseCases";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";


export class NewsLetterSubscribeController {
    constructor(private _newsLetterSubscribeUseCases: INewsLetterSubscribeUseCases) { }

    // Update newsletter subscription
    updateNewsletter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserIdFromRequest(req);
            const { subscribed } = req.body;
            console.log(subscribed,'subscribe');
            
            const result = await this._newsLetterSubscribeUseCases.updateNewsletter(userId, subscribed);
            res.status(HttpStatus.CREATED).json({
                success: true,
                data: result,
                message: 'Newsletter subscription updated successfully',
            });

        }catch(error){
            next(error);
        }
    }

}            