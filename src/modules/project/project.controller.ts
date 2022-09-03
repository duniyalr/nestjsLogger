import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { transformWithExclude } from '../../helpers/transform.helper';
import { IndexDto, ORDER } from '../base/dtos/index.dto';
import { SuccessDto } from '../base/dtos/success.dto';
import { AdminGuard } from '../base/guards/Admin.guard';
import { CreateProjectDto } from './dtos/createProject.dto';
import { GetProjectDto } from './dtos/getProject.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

export class ProjectOut {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}

@Controller('project')
@UseGuards(AdminGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async createProject(
    @Body(ValidationPipe) createProjectDto: CreateProjectDto,
  ) {
    let project: Project;
    try {
      project = await this.projectService.createProject(createProjectDto);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Project name exists');
      }
      throw err;
    }

    const out = transformWithExclude(project, ProjectOut);
    return out;
  }

  @Get("index")
  @UsePipes(new ValidationPipe({transform: true}))
  async indexProject(@Query() indexDto: IndexDto) {
    let indexPageDto = await this.projectService.index(indexDto);

    indexPageDto.items = transformWithExclude(indexPageDto.items, ProjectOut) as Project[];
    return indexPageDto;
  } 

  @Get(":projectId")
  async getProject(@Param(ValidationPipe) getProjectDto: GetProjectDto) {
    const project = await this.projectService.getProjectById(
      getProjectDto.projectId,
    );

    if (!project)
      throw new NotFoundException(
        `project with "${getProjectDto.projectId}" not founded`,
      );

    const out = transformWithExclude(project, ProjectOut);
    return out;
  }

  @Patch(":projectId")
  async updateProject(@Body(ValidationPipe) createProjectDto: CreateProjectDto, @Param("projectId") projectId: string) {
    const checkProject = await this.projectService.getProjectByName(createProjectDto.name);

    if (checkProject.id === projectId) return new SuccessDto();
    if (checkProject) throw new BadRequestException(`"${createProjectDto.name}" project name exists`);

    await this.projectService.updateProject({name: createProjectDto.name, id: projectId  })
    return new SuccessDto();
  }

}
