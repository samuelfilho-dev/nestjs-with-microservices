import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(305)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async findCategories(@Query('categoryId') _id: string) {
    return await this.categoryService.findCategories(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateCategories(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('_id') _id: string,
  ) {
    await this.categoryService.updateCategories(_id, updateCategoryDto);
  }
}
