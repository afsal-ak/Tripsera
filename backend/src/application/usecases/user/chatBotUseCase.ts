import { IChatbotUseCase } from "@application/useCaseInterfaces/user/IChatbotUseCase";
import { IChatbotService } from "@domain/entities/IChatBotService";

export class ChatbotUseCase implements IChatbotUseCase {
  constructor(private readonly chatbotService: IChatbotService) { }

  // async chatBotResponse(message: string): Promise<string> {
  //   return await this.chatbotService.generateResponse(message);
  // }

  async chatBotResponse(message: string): Promise<string> {
    const keywords = [
      // General
      "travel", "trip", "tour", "holiday", "vacation", "journey", "tourism", "wanderlust", "getaway", "backpacking",
      // Transport
      "flight", "airline", "airport", "boarding", "ticket", "train", "railway",
       "bus", "cruise", "ferry", "car rental", "cab", "ride", "transport",
      // Stay
      "hotel", "resort", "hostel", "guesthouse", "homestay", "accommodation",
      "lodging", "airbnb",
      // Destinations
      "destination", "city", "country", "island", "beach", "mountain", "hill station",
       "desert", "national park", "world heritage", "attraction", "sightseeing", "landmark",
      // Travel documents
      "visa", "passport", "immigration", "customs", "entry permit", "boarding pass",
      // Activities
      "itinerary", "adventure", "trekking", "hiking", "safari", "diving", "snorkeling",
       "skiing", "rafting", "camping", "road trip", "excursion", "explore",
      // Food & culture
      "cuisine", "restaurant", "street food", "festival", "culture", "heritage",
      // Travel planning
      "package", "booking", "reservation", "deal", "offer", "discount", "schedule",
       "map", "guide", "planner", "budget", "insurance",
       "place",'india','kerala'
    ];


    const isTravel = keywords.some((word) =>
      message.toLowerCase().includes(word)
    );

    if (!isTravel) {
      return " Please ask a travel-related question.";
    }

    return await this.chatbotService.generateResponse(message);
  }
}
