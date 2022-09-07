import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { IndexSectionDto } from "../base/dtos/indexSection.dto";
import { CreateSectionDto } from "./dtos/createSection.dto";
import { UpdateSectionDto } from "./dtos/updateSection.dto";
import { Section } from "./entities/section.entities";
import { scapeSqlLikeOperator } from "../../helpers/escape.helper";
import { IndexSectionSortBy } from "../base/dtos/indexSection.dto";
import { PageMetaDto } from "../base/dtos/pageMeta.dto";
import { IndexDto } from "../base/dtos/index.dto";
import { IndexPageDto } from "../base/dtos/indexPage.dto";

@Injectable()
export class SectionService {
  constructor(
    private dataSource: DataSource
  ) {}

  async createNewSection(createSectionDto: CreateSectionDto) {
    const section = this.dataSource.getRepository(Section).create({
      name: createSectionDto.name
    });

    await this.dataSource.getRepository(Section)
      .createQueryBuilder("sections")
      .insert()
      .into("sections")
      .values(section)
      .execute();
    
    await this.dataSource.getRepository(Section)
      .createQueryBuilder("section")
      .relation("project")
      .of(section)
      .set(createSectionDto.projectId);

    return section;
  }

  getSectionByName(sectionName: string, projectId: string) {
    return this.dataSource.getRepository(Section)
      .createQueryBuilder("section")
      .leftJoinAndSelect("section.project", "project")
      .where("section.name = :name", {name: sectionName})
      .andWhere("project.id = :id", {id: projectId})
      .getOne();
  }

  getSectionById(sectionId: string, withProject: boolean = false) {
    const queryBuilder = this.dataSource.getRepository(Section) 
    .createQueryBuilder("section")
    

    if (withProject) {
      queryBuilder.innerJoinAndSelect("section.project", "project")
    }

    return queryBuilder
            .where("section.id = :id", {id: sectionId})
            .getOne();
  }

  async index(indexSectionDto: IndexSectionDto) {
    const queryBuilder = this.dataSource.getRepository(Section)
      .createQueryBuilder("section")
      .innerJoinAndSelect("section.project", "project")
      
      
      
    if (indexSectionDto.sortBy === IndexSectionSortBy.PROJECT_ID) {
      queryBuilder
      .orderBy("project.id", indexSectionDto.sortOrder);
    } else {
      queryBuilder
      .orderBy("section.createdAt", indexSectionDto.sortOrder);
    }
    
    if (indexSectionDto.q) {
      queryBuilder.where("section.name like :like", {like: `%${scapeSqlLikeOperator(indexSectionDto.q)}%`});
    }

    if(indexSectionDto.projectId) {
      queryBuilder.andWhere("project.id = :projectId", {projectId: indexSectionDto.projectId});
    }
    
    queryBuilder
    .take(indexSectionDto.take)
    .skip(indexSectionDto.skip)
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({indexDto: indexSectionDto as IndexDto, itemCount});

    return new IndexPageDto(entities, pageMetaDto);
  }

  async updateSectionById(updateData: UpdateSectionDto, sectionId: string) {
    const sectionRepo = this.dataSource.getRepository(Section);

    const {projectId, ...safeUpdateData} = updateData;
    
    if (projectId) {
      await sectionRepo.createQueryBuilder("section")
        .relation("project")
        .of(sectionId)
        .set(projectId);
    }

    return sectionRepo
      .createQueryBuilder()
      .update("sections")
      .set(safeUpdateData)
      .where("id = :id", {id: sectionId})
      .execute();
  }

  deleteSectionById(sectionId: string) {
    return this.dataSource.getRepository(Section)
      .createQueryBuilder("section")
      .where("sections.id = :id",  {id: sectionId})
      .andWhere("sections.deletedAt IS NULL")
      .softDelete()
      .execute();
  }
}