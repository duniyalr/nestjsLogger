import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { config } from "process";
import { Observable } from "rxjs";
import { ConfigService } from "../../base/config.service";

@Injectable()
export class RegisterAdminGuard implements CanActivate {
  constructor(
    private configService: ConfigService
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const secret = context.switchToHttp().getRequest().headers[this.configService.sessionHeaderKey];

      return Boolean(
        secret &&
        secret === this.configService.registerAdminSecret
      )
  }
}