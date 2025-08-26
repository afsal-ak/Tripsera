export interface IChatbotUseCase {
  chatBotResponse(message: string): Promise<string>;
}
