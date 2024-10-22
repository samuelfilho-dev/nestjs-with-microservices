import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { AwsModule } from 'src/aws/aws.module';
import { PlayerService } from './player.service';

@Module({
  imports: [ProxyModule, AwsModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
