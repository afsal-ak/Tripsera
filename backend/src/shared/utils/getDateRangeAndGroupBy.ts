 
import { IDateFilter } from "@application/dtos/DashboardDTO";

export interface IDateRangeResult {
  startDate: Date;
  endDate: Date;
  groupBy: "hour" | "day" | "month" | "year";
}

export class DateUtil {

}
