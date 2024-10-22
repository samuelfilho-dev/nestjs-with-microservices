import { IsEmail, Matches } from 'class-validator';

export class AuthChangePasswordUserDto {
  @IsEmail()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Bad password',
  })
  lastPassword: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Bad password',
  })
  newPassword: string;
}
