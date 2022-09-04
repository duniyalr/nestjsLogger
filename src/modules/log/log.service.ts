import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateLogDto } from "./dtos/createLog.dto";
import { User } from "../user/entities/user.entity";
import { Log } from "./entities/log.entity";
@Injectable()
export class LogService {
  constructor(
    private dataSource: DataSource
  ) {}

  async createLog(createLogDto: CreateLogDto, user: User) {
    const logRepo = this.dataSource.getRepository(Log);
    const log = logRepo.create({
      ...createLogDto,
      section: user.section,
      user: user
    });

    await logRepo.save(log);

    return log;
  }
}