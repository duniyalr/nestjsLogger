import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateLogDto } from "./dtos/createLog.dto";
import { User } from "../user/entities/user.entity";
import { Log } from "./entities/log.entity";
import { IndexLogDto } from "../base/dtos/indexLog.dto";
import { PageMetaDto } from "../base/dtos/pageMeta.dto";
import { IndexPageDto } from "../base/dtos/indexPage.dto";
import { IndexDto } from "../base/dtos/index.dto";
import { scapeSqlLikeOperator } from "../../helpers/escape.helper";
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

  async index(indexLogDto: IndexLogDto) {
    const queryBuilder = this.dataSource.getRepository(Log)
      .createQueryBuilder("log")
      .innerJoinAndSelect("log.section","section")
      .innerJoinAndSelect("section.project", "project")
    

    if (indexLogDto.projectId) {
      queryBuilder.andWhere("project.id = :id", {id: indexLogDto.projectId});
    }

    if(indexLogDto.sectionId) {
      queryBuilder.andWhere("section.id = :id", {id: indexLogDto.sectionId});
    }

    if (indexLogDto.q) {
      queryBuilder.where("log.url like :like", {like: `%${scapeSqlLikeOperator(indexLogDto.q)}%`});
    }

    let sortBy;
    switch(indexLogDto.sortBy) {
      case "createdAt":
        sortBy = "createdAt"
        break;
      case "projectId":
        sortBy = "project.id";
        break;
      case "sectionId":
        sortBy = "section.id";
    }

    queryBuilder.orderBy(sortBy, indexLogDto.sortOrder);

    queryBuilder
    .take(indexLogDto.take)
    .skip(indexLogDto.skip)
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({indexDto: indexLogDto as IndexDto, itemCount});

    return new IndexPageDto(entities, pageMetaDto);
    
  }
}
