import { NestMiddleware, Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SectionSession } from "../../section/entities/sectionSession.entity";
import { SectionService } from "../../section/section.service";
import { User } from "src/modules/user/entities/user.entity";
import { Session } from "../../session/entities/session.entity";
import { SessionService } from "../../session/session.service";
import { ConfigService } from "../config.service";
import { Role } from "../entities/role.enum";
import { GetUserMiddlewareException, Payload as ExceptionPayload } from "../exceptions/getUserMiddleware.exception";
import { Section } from "../../section/entities/section.entity";

export type AuthenticatedRequest = Request & {
  section: Section;
}

@Injectable()
export class GetSectionMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private sectionService: SectionService
  ) {}
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    let sessionString = req.headers[this.configService.sessionHeaderKey];  
    let sessionTypeString = req.headers[this.configService.sessionTypeHeaderKey];

    if (Array.isArray(sessionString)) sessionString = sessionString[0];
    if (Array.isArray(sessionTypeString)) sessionTypeString = sessionTypeString[0];
    if (!sessionString || !sessionTypeString || sessionTypeString !== "section") return next();

    const session = await this.sectionService.getSectionSession(sessionString) as SectionSession;
    if (!session) {
      const exceptionPayload = new ExceptionPayload("Session not found")
      return next(new GetUserMiddlewareException(exceptionPayload));
    }

    const section = session.section;

    req.section = section;
    return next();
  }
}