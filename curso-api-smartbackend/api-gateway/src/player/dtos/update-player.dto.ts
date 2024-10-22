import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  readonly phoneNumber?: string;

  @IsNotEmpty()
  readonly name?: string;

  @IsNotEmpty()
  readonly category?: string;

  @IsOptional()
  photoUrl?: string;
}
