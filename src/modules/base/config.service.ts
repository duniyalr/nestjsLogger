import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  readonly userSessionExpireTime: number
  constructor(
  ) {
    this.userSessionExpireTime  = 24 * 60 * 60 * 1000 // 1 day
  }
}