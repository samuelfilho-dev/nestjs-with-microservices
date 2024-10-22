import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthUserRegisterDto } from './dtos/auth-register-user.dto';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthChangePasswordUserDto } from './dtos/auth-change-password.dto';
import { AuthLForgetPasswordUserDto } from './dtos/auth-forget-password.dto';
import { AuthCheckPasswordUserDto } from './dtos/auth-check-password.dto';

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

  @Post('change-password')
  async changePassword(
    @Body() authChangePasswordUserDto: AuthChangePasswordUserDto,
  ) {
    const res = await this.awsCognitoService.changeUserPassword(
      authChangePasswordUserDto,
    );

    if (res === 'SUCCESS') {
      return {
        status: 'success',
      };
    }
  }

  @Post('forget-password')
  async forgetPassword(authLForgetPasswordUserDto: AuthLForgetPasswordUserDto) {
    const res = await this.awsCognitoService.forgetPassword(
      authLForgetPasswordUserDto,
    );

    return res;
  }

  @Post('check-password')
  async checkPassword(authCheckPasswordUserDto: AuthCheckPasswordUserDto) {
    return await this.awsCognitoService.checkPassword(authCheckPasswordUserDto);
  }

  @Get('users')
  async findAllCognitoUsers(@Query('user') user: string) {
    if (!user) {
      throw new ConflictException(`Param user is required`);
    }

    return await this.awsCognitoService.findAllCognitoUsers(user);
  }
}
