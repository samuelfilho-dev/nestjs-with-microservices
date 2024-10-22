import { Module } from '@nestjs/common';
import { ProxyProvider } from './proxy.provider';

@Module({
  providers: [ProxyProvider],
  exports: [ProxyProvider],
})
export class ProxyModule {}
