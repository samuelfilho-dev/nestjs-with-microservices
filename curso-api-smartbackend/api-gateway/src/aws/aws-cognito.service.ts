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
import { AuthChangePasswordUserDto } from 'src/auth/dtos/auth-change-password.dto';
import { AuthLForgetPasswordUserDto } from 'src/auth/dtos/auth-forget-password.dto';
import { AuthCheckPasswordUserDto } from 'src/auth/dtos/auth-check-password.dto';
import * as AWS from 'aws-sdk';

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

  async changeUserPassword(
    authChangePasswordUserDto: AuthChangePasswordUserDto,
  ) {
    const { email, lastPassword, newPassword } = authChangePasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: lastPassword,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.changePassword(
            lastPassword,
            newPassword,
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result);
            },
          );
        },
        onFailure: (err) => {
          resolve(err);
        },
      });
    });
  }

  async forgetPassword(authLForgetPasswordUserDto: AuthLForgetPasswordUserDto) {
    const { email } = authLForgetPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async checkPassword(authCheckPasswordUserDto: AuthCheckPasswordUserDto) {
    const { email, confirmCode, newPassword } = authCheckPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.confirmPassword(confirmCode, newPassword, {
        onSuccess: () => {
          resolve({
            status: 'success',
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async findAllCognitoUsers(user: string) {
    const params = {
      UserPoolId: this.awsCognitoConfigService.userPoolId,
      Filter: `email = '${user}'`,
    };

    return new Promise((resolve, reject) => {
      AWS.config.update({
        region: this.awsCognitoConfigService.region,
        accessKeyId: this.awsCognitoConfigService.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.awsCognitoConfigService.AWS_SECRET_ACCESS_KEY,
      });

      const cognitoIdentityServiceProvider =
        new AWS.CognitoIdentityServiceProvider();

      cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
