import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('categories') readonly categoryModel: Model<Category>,
    private readonly playerService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const findedCategory = await this.categoryModel
      .findOne({ category })
      .exec();

    if (findedCategory) {
      throw new UnprocessableEntityException(
        `Category '${category} is already exists'`,
      );
    }

    const categoryCreated = new this.categoryModel(createCategoryDto);

    return await categoryCreated.save();
  }

  async findAllCategories(): Promise<Array<Category>> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async findCategoryById(category: string): Promise<Category> {
    const findedCategory = await this.categoryModel
      .findOne({ category })
      .populate('players')
      .exec();

    if (!findedCategory) {
      throw new NotFoundException(`Category '${findedCategory}' not exists`);
    }

    return findedCategory;
  }

  async findCategoryByPlayer(idPlayer: any): Promise<Category> {
    const players = await this.playerService.findAllPlayers();

    const playerFilter = players.filter((player) => player._id == idPlayer);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`Id: ${idPlayer} is not a player`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(idPlayer)
      .exec();
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const findedCategory = await this.categoryModel
      .findOne({ category })
      .exec();

    if (!findedCategory) {
      throw new NotFoundException(`Category '${category}' not exists`);
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async assignPlayerWithCategory(params: string[]): Promise<void> {
    const category = params['category'];
    const idPlayer = params['idPlayer'];

    const findedCategory = await this.categoryModel
      .findOne({ category })
      .exec();

    const playerIsExistsInCategory = await this.categoryModel
      .find({ category })
      .where('players')
      .in(idPlayer)
      .exec();

    await this.playerService.findPlayerById(idPlayer);

    if (!findedCategory) {
      throw new NotFoundException(`Category '${findedCategory}' not exists`);
    }

    if (playerIsExistsInCategory.length > 0) {
      throw new UnprocessableEntityException(
        `Player with id: '${idPlayer}' already registered at Category ${category}'`,
      );
    }

    findedCategory.players.push(idPlayer);

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: findedCategory })
      .exec();
  }
}
