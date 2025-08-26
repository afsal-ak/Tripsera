import { IChatbotUseCase } from "@application/useCaseInterfaces/user/IChatbotUseCase";
import { IChatbotService } from "@domain/entities/IChatbotService";

export class ChatbotUseCase implements IChatbotUseCase {
  constructor(private readonly chatbotService: IChatbotService) {}

  async chatBotResponse(message: string): Promise<string> {
    return await this.chatbotService.generateResponse(message);
  }
}
