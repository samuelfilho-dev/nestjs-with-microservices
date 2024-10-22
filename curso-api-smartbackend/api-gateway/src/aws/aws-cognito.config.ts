import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsCognitoConfigService {
  constructor(private readonly configService: ConfigService) {}

  public userPoolId: string = this.configService.get<string>(
    'COGNITO_USER_POOL_ID',
  );
  public clientId: string = this.configService.get<string>('COGNITO_CLIENT_ID');
  public region: string = this.configService.get<string>('AWS_REGION');
  public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}
