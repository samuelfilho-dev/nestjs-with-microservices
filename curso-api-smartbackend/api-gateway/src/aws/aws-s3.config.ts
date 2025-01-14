import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Config {
  constructor(private readonly configService: ConfigService) {}

  public readonly AWS_ENDPOINT = this.configService.get<string>('AWS_ENDPOINT');
  public readonly AWS_BUCKET_NAME =
    this.configService.get<string>('AWS_BUCKET_NAME');
  public readonly AWS_REGION = this.configService.get<string>('AWS_REGION');
  public readonly AWS_ACCESS_KEY_ID =
    this.configService.get<string>('AWS_ACCESS_KEY_ID');
  public readonly AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
    'AWS_SECRET_ACCESS_KEY',
  );
}
