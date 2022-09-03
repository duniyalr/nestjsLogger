import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateSectionDto } from "./dtos/createSection.dto";
import { UpdateSectionDto } from "./dtos/updateSection.dto";
import { Section } from "./entities/section.entities";

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
      .andWhere("projectId = :id", {id: projectId})
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
}