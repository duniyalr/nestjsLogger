import { NestMiddleware, Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SessionService, RequestUser } from "../../session/session.service";
import { ConfigService } from "../config.service";

export type AuthenticatedRequest = Request & {
  user: RequestUser;
}

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private sessionService: SessionService
  ) {}
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    let sessionString = req.headers[this.configService.sessionHeaderKey];  
    if (Array.isArray(sessionString)) sessionString = sessionString[0];
    if (!sessionString) return next();

    const session = await this.sessionService.getSessionWithUserBySessionString(sessionString);
    if (!session) return next();

    if (session.expiredAt < new Date()) {
      await this.sessionService.deleteSessionById(session.id);
      return next(new UnauthorizedException());
    }
    if (!session.user.active) return next(new ForbiddenException());

    req.user = session.user;
    return next();
  }
}