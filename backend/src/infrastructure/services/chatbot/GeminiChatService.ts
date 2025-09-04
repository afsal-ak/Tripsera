
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IChatbotService } from "@domain/entities/IChatbotService";
import { AppError } from "@shared/utils/AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export class GeminiChatbotService implements IChatbotService {
  private model;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error("Gemini API Error:", error.message);
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to fetch response from Gemini API"
      );
    }
  }
}
