import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthUserRegisterDto } from 'src/auth/dtos/auth-register-user.dto';
import { AwsCognitoConfigService } from './aws-cognito.config';
import { AuthLoginUserDto } from 'src/auth/dtos/auth-login-user.dto';

@Injectable()
export class AwsCognitoService {
  constructor(
    private readonly awsCognitoConfigService: AwsCognitoConfigService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.awsCognitoConfigService.userPoolId,
      ClientId: this.awsCognitoConfigService.clientId,
    });
  }

  private readonly userPool: CognitoUserPool;

  async registerUser(authUserRegisterDto: AuthUserRegisterDto) {
    const { name, email, password, phoneNumber } = authUserRegisterDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber,
          }),
          new CognitoUserAttribute({ Name: 'name', Value: name }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async authUser(authLoginUserDto: AuthLoginUserDto) {
    const { email, password } = authLoginUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async mockUserCognito() {}
}
