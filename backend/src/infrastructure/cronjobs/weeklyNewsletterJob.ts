import cron from "node-cron";

import { NewsLetterSubscriceUseCases } from "@application/usecases/user/newsLetterSubscribeUseCases";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { DashboardRepository } from "@infrastructure/repositories/DashboardRepository";

const userRepo = new UserRepository();
const dashboardRepo = new DashboardRepository();
const sendWeeklyNewsletterUseCase = new NewsLetterSubscriceUseCases(userRepo, dashboardRepo);

// Run every Monday at 9:00 AM
 cron.schedule("0 9 * * MON", async () => {
//cron.schedule("* * * * *", async () => {

    console.log(" [CRON] Running weekly newsletter job...");
    try {
        await sendWeeklyNewsletterUseCase.sendWeeklyTopPackagesNewsletter();
    } catch (error) {
        console.error(" Failed to send weekly newsletter:", (error as Error).message);
    }
});

export const startNewsletterCron = () => {
  console.log(" Newsletter cron initialized");
};