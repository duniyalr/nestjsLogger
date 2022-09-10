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
import { Section } from "../section/entities/section.entity";
@Injectable()
export class LogService {
  constructor(
    private dataSource: DataSource
  ) {}

  async createLog(createLogDto: CreateLogDto, section: Section) {
    const logRepo = this.dataSource.getRepository(Log);
    const log = logRepo.create({
      ...createLogDto,
      section: section
    });

    await logRepo.save(log);

    return log;
  }

  async index(indexLogDto: IndexLogDto) {
    const queryBuilder = this.dataSource.getRepository(Log)
      .createQueryBuilder("log")
      .innerJoinAndSelect("log.section","s")
      .innerJoinAndSelect("s.project", "project")
    

      if (indexLogDto.projectId) {
        queryBuilder.andWhere("project.id = :projectId", {projectId: indexLogDto.projectId});
      }

    if(indexLogDto.sectionId) {
      queryBuilder.andWhere("s.id = :sectionId", {sectionId: indexLogDto.sectionId});
    }

    if (indexLogDto.q) {
      queryBuilder.andWhere("log.url like :like", {like: `%${scapeSqlLikeOperator(indexLogDto.q)}%`});
    }

    let sortBy;
    switch(indexLogDto.sortBy) {
      case "createdAt":
        sortBy = "log.createdAt"
        break;
      case "projectId":
        sortBy = "project.id";
        break;
      case "sectionId":
        sortBy = "s.id";
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

  async getLog(logId: string) {
    const queryBuilder = this.dataSource.getRepository(Log)
      .createQueryBuilder("log");
    
    queryBuilder
      .innerJoinAndSelect("log.section", "section")
      .innerJoinAndSelect("section.project", "project")
      .where("log.id = :logId", {logId})

    return queryBuilder.getOne();
  }
}
