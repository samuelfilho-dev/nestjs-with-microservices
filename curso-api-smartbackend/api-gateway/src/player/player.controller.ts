import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ValidatorParamPipe } from 'src/commom/pipes/validator-param.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dtos/file-upload-dto';

@ApiTags('players')
@Controller('api/v1/players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playerService.createPlayer(createPlayerDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findPlayers(@Query('playerId') _id: string) {
    return await this.playerService.findPlayers(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidatorParamPipe) _id: string,
  ) {
    await this.playerService.updatePlayer(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id') _id: string) {
    await this.playerService.deletePlayer(_id);
  }

  @Post('/:_id/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'photo profile',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhotoProfile(
    @UploadedFile() file: Express.Multer.File,
    @Param('_id') _id: string,
  ) {
    return await this.playerService.uploadPhotoProfile(_id, file);
  }
}
