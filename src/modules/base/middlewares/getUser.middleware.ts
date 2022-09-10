import { NestMiddleware, Injectable, UnauthorizedException, ForbiddenException, ConsoleLogger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { User } from "src/modules/user/entities/user.entity";
import { Session } from "../../session/entities/session.entity";
import { SessionService } from "../../session/session.service";
import { ConfigService } from "../config.service";
import { Role } from "../entities/role.enum";
import { GetUserMiddlewareException, Payload as ExceptionPayload } from "../exceptions/getUserMiddleware.exception";

export type AuthenticatedRequest = Request & {
  user: User;
}

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private sessionService: SessionService
  ) {}
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.headers[this.configService.sessionTypeHeaderKey]) return next();
    let sessionString = req.headers[this.configService.sessionHeaderKey];  
    if (Array.isArray(sessionString)) sessionString = sessionString[0];
    if (!sessionString) return next();

    const session = await this.sessionService.getSessionWithUserBySessionString(sessionString) as Session;
    if (!session) {
      const exceptionPayload = new ExceptionPayload("Session not found")
      return next(new GetUserMiddlewareException(exceptionPayload));
    }

    if (session.expiredAt < new Date()) {      
      const exceptionPayload = new ExceptionPayload("Session expired", session)
      return next(new GetUserMiddlewareException(exceptionPayload));
    }

    const user = session.user;
    if (!user.active) return next(new ForbiddenException("Your user is deactive"));
    if (user.role === Role.USER) {
      const section = user.section;
      if (!section) {
        return next(new ForbiddenException("Your user is deactive"))
      }

      // TODO for deactive sections
    } 
    req.user = session.user;
    return next();
  }
}