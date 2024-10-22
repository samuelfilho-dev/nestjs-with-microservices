import { Injectable, Logger } from '@nestjs/common';
import { Challenge } from './interfaces/challenge.interface';
import { RpcException } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { ClientProxySmartRanking } from './proxyrmq/proxyrmq.service';
import { Player } from './interfaces/player.interface';
import { lastValueFrom } from 'rxjs';
import HTML_OPPONENT_NOTIFICATION from './static/html-notification.opponent';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger: Logger = new Logger(AppService.name);

  private readonly clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async sendChallengeEmail(challenge: Challenge) {
    try {
      let opponentId;

      challenge.players.forEach((player) => {
        if (player != challenge.requester) {
          opponentId = player;
        }
      });

      const opponent: Player = await lastValueFrom(
        this.clientAdminBackend.send('find-players', opponentId),
      );

      const requester: Player = await lastValueFrom(
        this.clientAdminBackend.send('find-players', challenge.requester),
      );

      let markupMail = HTML_OPPONENT_NOTIFICATION;
      markupMail = markupMail.replace('#NOME_ADVERSARIO', opponent.name);
      markupMail = markupMail.replace('#NOME_SOLICITANTE', requester.name);

      const sendMail = this.configService.get('MAIL_USER');

      this.mailerService
        .sendMail({
          to: opponent.email,
          from: sendMail,
          subject: 'Notificação de Desafio',
          html: markupMail,
        })
        .then((success) => {
          this.logger.log(`Success in Send Mail ${JSON.stringify(success)}`);
        })
        .catch((err) => {
          this.logger.error(err.message);
        });
    } catch (error) {
      this.logger.error(`error: ${error}`);
      throw new RpcException(error.message);
    }
  }
}
