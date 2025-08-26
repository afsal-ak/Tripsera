// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { IChatService } from "@domain/entities/IChatService ";
// import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
// import { AppError } from "@shared/utils/AppError";

// const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
// const model = genAi.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" })

// export const chatWithGemini = async (message: string) => {
//     try {
//         const result = await model.generateContent(message)
//         return result.response.text();
//     } catch (error) {
//         console.error("Gemini API Error:", error);
//         throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR,"Failed to communicate with Gemini API");
//     }

// }
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
