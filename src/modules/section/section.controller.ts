import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { IndexSectionDto } from '../base/dtos/indexSection.dto';
import { SuccessDto } from '../base/dtos/success.dto';
import { AdminGuard } from '../base/guards/Admin.guard';
import { ProjectOut } from '../project/project.controller';
import { ProjectService } from '../project/project.service';
import { CreateSectionDto } from './dtos/createSection.dto';
import { UpdateSectionDto } from './dtos/updateSection.dto';
import { Section } from './entities/section.entity';
import { SectionService } from './section.service';

export class SectionOut {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Type(() => ProjectOut)
  @Expose()
  project: ProjectOut;
}

@Controller('section')
@UseGuards(AdminGuard)
export class SectionController {
  constructor(
    private sectionService: SectionService,
    private projectService: ProjectService,
  ) {}

  @Post()
  async createSection(
    @Body(ValidationPipe) createSectionDto: CreateSectionDto,
  ) {
    const checkSection = await this.sectionService.getSectionByName(
      createSectionDto.name,
      createSectionDto.projectId,
    );
    if (checkSection)
      throw new BadRequestException(
        `Section with "${createSectionDto.name}" exists in project`,
      );

    const projectCheck = await this.projectService.getProjectById(
      createSectionDto.projectId,
    );
    if (!projectCheck)
      throw new BadRequestException(
        `Project with "${createSectionDto.projectId}" not founded`,
      );

    const section = await this.sectionService.createNewSection(
      createSectionDto,
    );
    return transformWithExclude(section, SectionOut);
  }

  @Get('index')
  @UsePipes(new ValidationPipe({ transform: true }))
  async indexSection(@Query() indexSectionDto: IndexSectionDto) {
    const indexPageDto = await this.sectionService.index(indexSectionDto);

    indexPageDto.items = transformWithExclude(
      indexPageDto.items,
      SectionOut,
    ) as Section[];
    return indexPageDto;
  }

  @Get(':sectionId')
  async getSection(@Param('sectionId') sectionId: string) {
    const section = await this.sectionService.getSectionById(sectionId, true);
    if (!section) throw new NotFoundException();

    return transformWithExclude(section, SectionOut);
  }

  @Patch(':sectionId')
  async updateSection(
    @Body(ValidationPipe) updateSectionDto: UpdateSectionDto,
    @Param('sectionId') sectionId: string,
  ) {
    const section = await this.sectionService.getSectionById(sectionId, true);
    if (!section)
      throw new NotFoundException(`Section with id ${sectionId} not found`);

    if (updateSectionDto.projectId) {
      const checkProject = await this.projectService.getProjectById(
        updateSectionDto.projectId,
      );
      if (!checkProject)
        throw new NotFoundException(
          `Project id "${updateSectionDto.projectId}" not found`,
        );
    }

    if (updateSectionDto.name && updateSectionDto.name !== section.name) {
      const checkSection = await this.sectionService.getSectionByName(
        updateSectionDto.name,
        section.project.id,
      );
      if (checkSection)
        throw new BadRequestException(
          `Section with "${updateSectionDto.name}" already exists in "${section.project.name}"`,
        );
    }

    await this.sectionService.updateSectionById(updateSectionDto, sectionId);
    return new SuccessDto();
  }

  @Delete(':sectionId')
  async deleteSection(@Param('sectionId') sectionId: string) {
    const deleteResult = await this.sectionService.deleteSectionById(sectionId);
    if (deleteResult.affected === 0)
      throw new NotFoundException(`Section with "${sectionId}" not found`);

    return new SuccessDto();
  }
}
