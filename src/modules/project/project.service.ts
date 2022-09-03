import { Injectable } from "@nestjs/common";
import { scapeSqlLikeOperator } from "../../helpers/escape.helper";
import { DataSource, Index } from "typeorm";
import { IndexDto } from "../base/dtos/index.dto";
import { IndexPageDto } from "../base/dtos/indexPage.dto";
import { PageMetaDto } from "../base/dtos/pageMeta.dto";
import { Project } from "./entities/project.entity";

type ProjectData = {
  id?: string;
  name: string
}

@Injectable() 
export class ProjectService {
  constructor(
    private dataSource: DataSource
  ) {}

  async createProject(projectData: ProjectData) {
    const project = this.dataSource.getRepository("Project").create({
      name: projectData.name
    }) as Project;

    await this.dataSource.getRepository("Project")
      .createQueryBuilder("project")
      .insert()
      .into("projects")
      .values(project)
      .execute();

    return project;
  }

  async getProjectById(projectId: string) {
    return this.dataSource.getRepository("Project")
      .createQueryBuilder("project")
      .where("project.id = :projectId", {projectId})
      .getOne();
  }

  async getProjectByName(projectName: string): Promise<Project> {
    return this.dataSource.getRepository(Project)
      .createQueryBuilder("project")
      .where("name = :name", {name: projectName})
      .getOne();
  }

  async index(indexDto: IndexDto): Promise<IndexPageDto<Project>> {
    const queryBuilder = this.dataSource.getRepository(Project)
      .createQueryBuilder("project")
      .where("project.name like :like", {like: `%${scapeSqlLikeOperator(indexDto.q)}%`})
      .orderBy("project.createdAt", indexDto.sortOrder)
      .skip(indexDto.skip)
      .take(indexDto.take)

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({itemCount, indexDto})

    return new IndexPageDto(entities, pageMetaDto)
  }

  async updateProject(projectData: ProjectData) {
    return this.dataSource.getRepository(Project)
      .createQueryBuilder("project")
      .update("projects")
      .set({
        name: projectData.name
      })
      .where("projects.id = :id", {id: projectData.id})
      .execute();
  }
}