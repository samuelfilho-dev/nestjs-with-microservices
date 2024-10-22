import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('category') private readonly categoryModel: Model<Category>,
  ) {}

  private readonly logger = new Logger(CategoryService.name);

  async createCategory(category: Category): Promise<Category> {
    try {
      const categoryCreated = new this.categoryModel(category);
      return await categoryCreated.save();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async findAllCategories(): Promise<Category[]> {
    try {
      const res = await this.categoryModel.find().exec();
      return res;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async findCategoryById(_id: any): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async updateCategory(_id: string, category: Category): Promise<void> {
    try {
      await this.categoryModel
        .findOneAndUpdate({ _id }, { $set: category })
        .exec();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }
}
