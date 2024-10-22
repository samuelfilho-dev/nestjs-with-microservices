import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthUserRegisterDto } from './dtos/auth-register-user.dto';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async createUser(@Body() authUserRegisterDto: AuthUserRegisterDto) {
    return this.awsCognitoService.registerUser(authUserRegisterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return await this.awsCognitoService.authUser(authLoginUserDto);
  }
}
