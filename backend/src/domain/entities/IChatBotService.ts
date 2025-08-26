export interface IChatbotService {
  generateResponse(prompt: string): Promise<string>;
}
