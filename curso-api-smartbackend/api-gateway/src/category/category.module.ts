import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { CategoryService } from './category.service';

@Module({
  imports: [ProxyModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
