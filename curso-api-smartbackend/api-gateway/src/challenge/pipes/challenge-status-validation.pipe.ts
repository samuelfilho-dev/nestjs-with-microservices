import { ConflictException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly permittedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELLED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new ConflictException(`'${status}' is invalid status`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const index = this.permittedStatus.indexOf(status);
    return index !== -1;
  }
}
