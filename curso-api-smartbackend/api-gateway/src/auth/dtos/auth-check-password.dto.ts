import { IsEmail, IsString, Matches } from 'class-validator';

export class AuthCheckPasswordUserDto {
  @IsEmail()
  email: string;

  @IsString()
  confirmCode: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Bad password',
  })
  newPassword: string;
}
