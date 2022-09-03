import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "../entities/role.enum";
import { AuthenticatedRequest } from "../middlewares/getUser.middleware";

@Injectable()
export class UserAndAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req: AuthenticatedRequest = context.switchToHttp().getRequest();

      return Boolean(        
        req.user &&
        [Role.USER, Role.ADMIN].includes(req.user.role)
      );
  }
}