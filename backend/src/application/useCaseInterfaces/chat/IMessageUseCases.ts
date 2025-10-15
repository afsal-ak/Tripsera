 import { IMessage } from "@domain/entities/IMessage";
 import { ICall } from "@domain/entities/ICall";
import { SendMessageDTO,UpdateMessageDTO } from "@application/dtos/MessageDTO";
import { IChatHistoryItem } from "@application/usecases/chat/messageUseCases";
export interface IMessageUseCases {
    sendMessage(data: SendMessageDTO): Promise<IMessage>
    getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<IMessage[]>
    markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null>
    deleteMessage(messageId: string): Promise<boolean>

//        updateMessage  (
//   messageId: string,
//   updates: Partial<IMessage>
// ): Promise<IMessage | null> 
  updateMessage(
    messageId: string,
    updates: UpdateMessageDTO
  ): Promise<IMessage | null>  
     
  //    getCombinedChatAndCallHistory(
//         roomId: string
//     ): Promise<(IMessage | ICall)[]>  
    getCombinedChatAndCallHistory(roomId: string): Promise<IChatHistoryItem[]>  
    getMessageById(id:string):Promise<IMessage|null>

}