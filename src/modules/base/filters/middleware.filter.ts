import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { SessionService } from "../../session/session.service";
import { ConfigService } from "../config.service";
import { GetUserMiddlewareException } from "../exceptions/getUserMiddleware.exception";
import { Response } from "express";
@Catch(GetUserMiddlewareException)
export class MiddlewareExceptionFilter implements ExceptionFilter {
  constructor(
    private configService: ConfigService,
    private sessionService: SessionService
  ) {}

  async catch(exception: any, host: ArgumentsHost) {
    const payload = exception.payload;
    const session = payload.session;

    if (session) {
      await this.sessionService.deleteSessionById(session.id);
    }

    const res: Response = host.switchToHttp().getResponse();
    res.status(401).json({
      status: 401,
      message: payload.message
    });
  }
}