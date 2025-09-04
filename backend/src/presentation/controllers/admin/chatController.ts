import { Request, Response,NextFunction } from "express";
import { IChatRoom } from "@domain/entities/IChatRoom";
import { CreateChatRoomDTO, toChatRoomResponseDTO } from "@application/dtos/ChatDTO";
import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatUseCases";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";


export class ChatRoomController {
    constructor(private readonly _chatRoomUseCases:IChatRoomUseCase){}

    createRoom=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try {
            const userId=getUserIdFromRequest(req)
            const data:CreateChatRoomDTO=req.body
            const room=await this._chatRoomUseCases.createChatRoom(data)
        } catch (error) {
            next(error)
        }
    }

}