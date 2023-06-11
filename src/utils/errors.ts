import { HttpStatus } from '@nestjs/common';
import { CONFIG } from './config';

export enum KaoriErrorCodes {
  UserNotTracked,
}

export interface IKaoriError {
  readonly code: KaoriErrorCodes;
  readonly message: string;
}

const ERROR_DEFINITION: {
  [K: number]: {
    message: string;
    status: HttpStatus;
  };
} = {
  [KaoriErrorCodes.UserNotTracked]: {
    message: `User not tracked by ${CONFIG.NAME}`,
    status: HttpStatus.NOT_FOUND,
  },
};

export class KaoriError implements IKaoriError {
  readonly message: string;
  constructor(readonly code: KaoriErrorCodes) {
    this.message = ERROR_DEFINITION[code]?.message;
  }
  get status(): HttpStatus {
    return ERROR_DEFINITION[this.code]?.status;
  }
}
