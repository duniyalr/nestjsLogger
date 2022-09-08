import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "../entities/role.enum";

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest();
      const user = req.user;

      return Boolean(
        user &&
        user.role === Role.USER
      )
  }
}