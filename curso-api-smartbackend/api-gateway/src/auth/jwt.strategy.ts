import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AwsCognitoConfigService } from 'src/aws/aws-cognito.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(JwtStrategy.name);

  constructor(private readonly awsCognitoConfig: AwsCognitoConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: awsCognitoConfig.clientId,
      issuer: awsCognitoConfig.authority,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${awsCognitoConfig.authority}/.well-known/jkws.json`,
      }),
    });
  }

  public async validate(payload: any) {
    this.logger.log(`Auth Payload: ${payload}`);

    return {
      UserId: payload.sub,
      email: payload.email,
    };
  }
}
