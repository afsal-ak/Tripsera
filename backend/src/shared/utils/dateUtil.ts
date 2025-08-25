// export function getDateRange(filter?: string, startDate?: string, endDate?: string) {
//   const today = new Date();
//   let from: Date | undefined;
//   let to: Date | undefined;

//   switch (filter) {
//     case "today":
//       from = new Date(today.setHours(0, 0, 0, 0));
//       to = new Date();
//       break;

//     case "this_week": {
//       const firstDay = today.getDate() - today.getDay();
//       from = new Date(today.setDate(firstDay));
//       from.setHours(0, 0, 0, 0);
//       to = new Date();
//       break;
//     }

//     case "this_month":
//       from = new Date(today.getFullYear(), today.getMonth(), 1);
//       to = new Date();
//       break;

//     case "this_year":
//       from = new Date(today.getFullYear(), 0, 1);
//       to = new Date();
//       break;

//     case "custom":
//       from = startDate ? new Date(startDate) : undefined;
//       to = endDate ? new Date(endDate) : undefined;
//       break;

//     default:
//       from = undefined;
//       to = undefined;
//   }

//   return { from, to };
// }
// src/application/utils/dateUtil.ts


// export const getDateRange = (
//   filter?: DateFilter,
//   startDate?: string,
//   endDate?: string,

// ): { startDate: Date; endDate: Date } => {
//   const now = new Date()

//   if (filter == 'custom' && startDate && endDate) {
//     return { startDate: new Date(startDate), endDate: new Date(endDate) }
//   }

//   switch (filter) {
//     case "today": {
//       const start = new Date(now.setHours(0, 0, 0, 0))
//       const end = new Date(now.setHours(23, 59, 59, 999))
//       return { startDate: start, endDate: end }
//     }

//     case 'this_week': {
//       const currentDay = now.getDay()
//       const diff = currentDay === 0 ? 6 : currentDay - 1;
//       const start = new Date(now);
//       start.setDate(now.getDate() - diff)
//       start.setHours(0, 0, 0, 0)

//       const end = new Date(start)
//       end.setDate(start.getDate() + 6)
//       end.setHours(23, 59, 59, 999)

//       return { startDate: start, endDate: end }
//     }

//     case 'this_month': {
//       const start = new Date(now.getFullYear(), now.getMonth(), 1)
//       const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
//       return { startDate: start, endDate: end }

//     }
//     case 'this_year': {
//       const start = new Date(now.getFullYear(), 0, 1)
//       const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
//       return { startDate: start, endDate: end }

//     }
//     default:{
//        const start = new Date(now.getFullYear(), now.getMonth(), 1);
//       const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
//       return { startDate: start, endDate: end };
//     }
//   }



// }
import {IDateFilter, DateFilter,IDateRangeResult  } from "@application/dtos/DashboardDTO";

export class DateUtil {
  static getDateRange(filter?: DateFilter, startDate?: string, endDate?: string) {
    const now = new Date();

    switch (filter) {
      case "today":
        return {
          startDate: new Date(now.setHours(0, 0, 0, 0)),
          endDate: new Date(now.setHours(23, 59, 59, 999)),
        };

      case "this_week": {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { startDate: start, endDate: end };
      }

      case "this_month": {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        return { startDate: start, endDate: end };
      }

      case "this_year": {
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { startDate: start, endDate: end };
      }

      case "custom": {
         if (startDate && endDate) {
          return { startDate: new Date(startDate), endDate: new Date(endDate) };
        }

         if (startDate && !endDate) {
          return { startDate: new Date(startDate), endDate: new Date() };
        }

         if (!startDate && endDate) {
          return { startDate: new Date(0), endDate: new Date(endDate) }; 
        }

         return { startDate: undefined, endDate: undefined };
      }

      default:
        return { startDate: undefined, endDate: undefined };
    }
  }
  
    static getDateRangeAndGroupBy(dateFilter: IDateFilter): IDateRangeResult {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;
    let groupBy: "hour" | "day" | "month" | "year" = "day";

    switch (dateFilter.filter) {
      case "today":
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        groupBy = "hour";
        break;

      case "this_week": {
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate = new Date(today.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setDate(diff + 6));
        endDate.setHours(23, 59, 59, 999);
        groupBy = "day";
        break;
      }

      case "this_month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        groupBy = "day";
        break;

      case "this_year":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        groupBy = "month";
        break;

      case "custom":
        if (!dateFilter.startDate || !dateFilter.endDate) {
          throw new Error("For custom filter, both startDate and endDate are required.");
        }

        startDate = new Date(dateFilter.startDate);
        endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999);

        const diffInDays =
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffInDays <= 1) groupBy = "hour";
        else if (diffInDays <= 31) groupBy = "day";
        else if (diffInDays <= 365) groupBy = "month";
        else groupBy = "year";
        break;

      default:
        // Default → current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        groupBy = "day";
        break;
    }

    return { startDate, endDate, groupBy };
  }
}
