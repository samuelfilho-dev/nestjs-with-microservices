import { Injectable } from '@nestjs/common';
import { ProxyProvider } from 'src/proxy/proxy.provider';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly proxyProvider: ProxyProvider) {}

  private clientAdminBackend =
    this.proxyProvider.getClientProxyAdminBackendInstance();

  async createCategory(createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  async findCategories(_id: string) {
    return this.clientAdminBackend.send('find-categories', _id ? _id : '');
  }

  async updateCategories(_id: string, updateCategoryDto: UpdateCategoryDto) {
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      category: updateCategoryDto,
    });
  }
}
