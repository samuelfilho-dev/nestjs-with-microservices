import { Injectable, NotFoundException } from '@nestjs/common';
import { ProxyProvider } from 'src/proxy/proxy.provider';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { lastValueFrom } from 'rxjs';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { AwsS3Service } from 'src/aws/aws-s3.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly proxyProvider: ProxyProvider,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  private readonly clientAdminBackend =
    this.proxyProvider.getClientProxyAdminBackendInstance();

  async createPlayer(createPlayerDto: CreatePlayerDto) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send('find-categories', createPlayerDto.category),
    );

    if (!category) {
      throw new NotFoundException(`Category:'${category} not found'`);
    }

    this.clientAdminBackend.emit('create-player', createPlayerDto);
  }

  async findPlayers(_id: string) {
    return this.clientAdminBackend.send('find-players', _id ? _id : '');
  }

  async updatePlayer(_id: string, updatePlayerDto: UpdatePlayerDto) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send('find-categories', updatePlayerDto.category),
    );
    if (!category) {
      throw new NotFoundException(`Category:'${category} not found'`);
    }

    this.clientAdminBackend.emit('update-player', {
      _id: _id,
      player: updatePlayerDto,
    });
  }

  async deletePlayer(_id: string) {
    this.clientAdminBackend.emit('delete-player', { _id });
  }

  async uploadPhotoProfile(_id: string, file: any) {
    const player = lastValueFrom(
      this.clientAdminBackend.send('find-players', _id),
    );

    if (!player) {
      throw new NotFoundException(`Player don't exits`);
    }

    const urlPlayerPhoto = await this.awsS3Service.uploadFile(file, _id);

    const updatePlayerDto: UpdatePlayerDto = {};
    updatePlayerDto.photoUrl = urlPlayerPhoto.url;

    this.clientAdminBackend.emit('update-player', {
      _id,
      player: updatePlayerDto,
    });

    return this.clientAdminBackend.send('find-players', _id);
  }
}
