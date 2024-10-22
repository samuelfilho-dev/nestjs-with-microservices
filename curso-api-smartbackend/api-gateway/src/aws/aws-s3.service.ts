import { Injectable, Logger } from '@nestjs/common';
import { AwsS3Config } from './aws-s3.config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  constructor(private readonly awsS3Config: AwsS3Config) {}

  private readonly logger = new Logger(AwsS3Service.name);

  public async uploadFile(file: any, id: string) {
    try {
      const s3 = new AWS.S3({
        endpoint: this.awsS3Config.AWS_ENDPOINT,
        region: this.awsS3Config.AWS_REGION,
        s3ForcePathStyle: true,
        credentials: {
          accessKeyId: this.awsS3Config.AWS_ACCESS_KEY_ID,
          secretAccessKey: this.awsS3Config.AWS_SECRET_ACCESS_KEY,
        },
      });

      const fileExtension = file.originalname.split('.')[1];
      const urlKey = `${id}.${fileExtension}`;

      const params = {
        Body: file.buffer,
        Bucket: this.awsS3Config.AWS_BUCKET_NAME,
        Key: urlKey,
      };

      const result = await s3.putObject(params).promise();
      this.logger.log(`S3 result: ${JSON.stringify(result)}`);

      return {
        url: `http://localhost:4566/${this.awsS3Config.AWS_BUCKET_NAME}/${urlKey}`,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error.message;
    }
  }
}
