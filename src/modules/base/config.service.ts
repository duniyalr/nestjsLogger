import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  readonly registerAdminSecret: string;
  readonly userSessionExpireTime: number;
  readonly sessionHeaderKey: string;
  constructor(
  ) {
    this.registerAdminSecret = "registerAdminSecret";
    this.userSessionExpireTime  = 24 * 60 * 60 * 1000; // one day
    this.sessionHeaderKey = "x-access-token";
  }
}