import { CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class SectionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest();
      return Boolean(req.section);
  }
}