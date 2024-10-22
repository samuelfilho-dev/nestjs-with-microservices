import { Controller, Logger } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from './interfaces/category.interface';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private readonly logger = new Logger(CategoryController.name);
  private readonly ackErrors: string[] = ['E11000'];

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `The category '${JSON.stringify(category)} has been created'`,
    );

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.categoryService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('find-categories')
  async findCategories(@Payload() _id: any, @Ctx() context: RmqContext) {
    this.logger.log(`The category '${_id}' was found`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (_id) {
        return await this.categoryService.findCategoryById(_id);
      } else {
        return await this.categoryService.findAllCategories();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`Update category '${JSON.stringify(data)}'`);

    try {
      const _id: any = data.id;
      const category: Category = data.category;
      await this.categoryService.updateCategory(_id, category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}
