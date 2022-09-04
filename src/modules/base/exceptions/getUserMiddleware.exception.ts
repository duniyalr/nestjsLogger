import { HttpException } from "@nestjs/common";
import { Session } from "../../session/entities/session.entity";

export class Payload {
  readonly message: string;
  readonly session: Session;

  constructor(message: string, session: Session = null) {
    this.message = message;
    this.session = session;
  }
}

export class GetUserMiddlewareException {
  readonly payload: Payload;
  constructor(payload: Payload) {
    this.payload = payload;
  }
}