 import { IMessage } from "@domain/entities/IMessage";
 import { SendMessageDTO,UpdateMessageDTO } from "@application/dtos/MessageDTO";
 export interface IMessageUseCases {
    sendMessage(data: SendMessageDTO): Promise<IMessage>
    getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<IMessage[]>
    markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null>
    deleteMessage(messageId: string): Promise<boolean>
  
  updateMessage(
    messageId: string,
    updates: UpdateMessageDTO
  ): Promise<IMessage | null>  
     
  //    getCombinedChatAndCallHistory(
//         roomId: string
//     ): Promise<(IMessage | ICall)[]>  
     getMessageById(id:string):Promise<IMessage|null>

}