import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsCognitoConfigService } from './aws-cognito.config';
import { AwsS3Config } from './aws-s3.config';
import { AwsS3Service } from './aws-s3.service';

@Module({
  providers: [
    AwsCognitoService,
    AwsCognitoConfigService,
    AwsS3Service,
    AwsS3Config,
  ],
  exports: [AwsCognitoService, AwsCognitoConfigService, AwsS3Service],
})
export class AwsModule {}
