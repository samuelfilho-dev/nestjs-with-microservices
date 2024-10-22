import { Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ProxyProvider } from 'src/proxy/proxy.provider';

@Injectable()
export class RankingService {
  constructor(private readonly proxyProvider: ProxyProvider) {}

  private readonly clientRankings =
    this.proxyProvider.getClientProxyRankingsInstance();

  async checkRanking(categoryId: string, dateRef: string) {
    if (!categoryId) {
      throw new NotFoundException(`Category Id is requested`);
    }

    return await lastValueFrom(
      this.clientRankings.send('check-ranking', {
        categoryId,
        dateRef: dateRef ? dateRef : ' ',
      }),
    );
  }
}
