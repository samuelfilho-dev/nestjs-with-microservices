import { IsEmail } from 'class-validator';

export class AuthLForgetPasswordUserDto {
  @IsEmail()
  email: string;
}
