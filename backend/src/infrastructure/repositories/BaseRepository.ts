import { Model, UpdateQuery, Document, SortOrder } from 'mongoose';
import { PaginationInfo } from '@application/dtos/PaginationDto';

export abstract class BaseRepository<T> {
  protected model: Model<T & Document>;

  constructor(model: Model<T & Document>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return (await this.model.create(data)).toObject();
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findById(id).lean();
    return result as T | null;
  }

  async findAll(
    page = 1,
    limit = 10,
    filter: Record<string, any> = {},
    sort: 'newest' | 'oldest' = 'newest'
  ): Promise<{ data: T[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;

    const sortOption: Record<string, SortOrder> =
      sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
      this.model.countDocuments(filter),
    ]);

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { data: data as T[], pagination };
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const result = await this.model
      .findByIdAndUpdate(
        id,
        { $set: data } as UpdateQuery<T & Document>,
        { new: true, runValidators: true })
      .lean();
    return result as T | null;
  }


  async updateByFilter(filter: object, data: Partial<T>): Promise<T | null> {
    console.log(filter, 'id in db')

    const result = await this.model
      .findOneAndUpdate(
        filter,
        { $set: data } as UpdateQuery<T & Document>,
        { new: true, lean: true }
      )
      .exec();

    return result as T | null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
