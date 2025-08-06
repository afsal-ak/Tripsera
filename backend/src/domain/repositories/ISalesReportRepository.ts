 import { IBooking } from '@domain/entities/IBooking';
import { FilterQuery } from 'mongoose';

export interface ISalesReportRepository {
  count(filter: FilterQuery<IBooking>): Promise<number>;
  find(filter: FilterQuery<IBooking>, options?: {
    skip?: number;
    limit?: number;
    sort?: any;
  }): Promise<IBooking[]>;
   calculateSummary(filter: any):Promise<any>
 }
