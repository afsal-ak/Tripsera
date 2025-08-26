import { NextFunction, Request, Response } from "express";
import { IChatbotUseCase } from "@application/useCaseInterfaces/user/IChatbotUseCase";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export class ChatController {
  constructor(private readonly chatUseCase: IChatbotUseCase) {}

  chatBot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { message } = req.body;
      const reply = await this.chatUseCase.chatBotResponse(message);
      res.status(HttpStatus.OK).json({ reply });
    } catch (error) {
      console.error("ChatController Error:", error);
      next(error);
    }
  };
}
