import { Injectable } from "@nestjs/common";
import { Expose } from "class-transformer";
import { transformWithExclude } from "../../helpers/transform.helper";
import { DataSource } from "typeorm";
import { ConfigService } from "../base/config.service";
import { User } from "../user/entities/user.entity";
import { Session } from "./entities/session.entity";
import { Role } from "../base/entities/role.enum";

export class RequestUser {
  @Expose() id: string;
  @Expose() username: string;
  @Expose() role: Role;
}

@Injectable() 
export class SessionService {
  constructor(
    private dataSource: DataSource,
    private readonly configService: ConfigService
  ) {}

  async createNewSession(user: User) {
    const session = this.dataSource.getRepository("Session").create({
      expiredAt: (new Date(Date.now() + this.configService.userSessionExpireTime))
    });
    await this.dataSource.getRepository("Session")
      .createQueryBuilder("session")
      .insert()
      .into("sessions")
      .values(session)
      .execute();

    await this.dataSource.createQueryBuilder()
      .relation(Session, "user")
      .of(session)
      .set(user);
    
    return session;
  }

  async getSessionsByUser(user: User) {
    return this.dataSource.getRepository("Session")
      .createQueryBuilder("session")
      .leftJoin("session.user", "user")
      .where("user.id = :userId", {userId: user.id})
      .orderBy("session.expiredAt", "DESC")
      .getMany();
  }

  async removeExpiredSessionsByUser(user: User) {
    return this.dataSource.getRepository("Session")
      .createQueryBuilder("session")
      .delete()
      .from("sessions")
      .where("userId = :userId", {userId: user.id}) // delete not supporting join
      .andWhere("sessions.expiredAt < Now()")
      .execute();
  }

  async getSessionWithUserBySessionString(sessionString: string) {
    return this.dataSource.getRepository("Session")
      .createQueryBuilder("session")
      .innerJoinAndSelect("session.user", "user")
      .where("session.session = :session", {session: sessionString})
      .getOne()
  }

  deleteSessionById(sessionId: string) {
    return this.dataSource.getRepository(Session)
      .createQueryBuilder()
      .delete()
      .from("sessions")
      .where("sessions.id = :id", {id: sessionId})
      .execute();
  }
}