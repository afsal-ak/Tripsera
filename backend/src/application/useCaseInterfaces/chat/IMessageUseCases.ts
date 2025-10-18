  import { SendMessageDTO,UpdateMessageDTO,
  MessageResponseDTO ,MessagePopulatedResponseDTO
} from "@application/dtos/MessageDTO";


 export interface IMessageUseCases {
    sendMessage(data: SendMessageDTO): Promise<MessagePopulatedResponseDTO>
    getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<MessagePopulatedResponseDTO[]>
    markMessageAsRead(messageId: string, userId: string): Promise<MessageResponseDTO | null>
    deleteMessage(messageId: string): Promise<boolean>
  
  updateMessage(
    messageId: string,
    updates: UpdateMessageDTO
  ): Promise<MessagePopulatedResponseDTO | null>  
 
     getMessageById(id:string):Promise<MessageResponseDTO|null>

}