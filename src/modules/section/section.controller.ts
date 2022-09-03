import { BadRequestException, Body, Controller, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { Expose } from "class-transformer";
import { transformWithExclude } from "../../helpers/transform.helper";
import { AdminGuard } from "../base/guards/Admin.guard";
import { ProjectService } from "../project/project.service";
import { CreateSectionDto } from "./dtos/createSection.dto";
import { SectionService } from "./section.service";

export class SectionOut {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() projectId: string;
}

@Controller("section")
@UseGuards(AdminGuard)
export class SectionController {
  constructor(
    private sectionService: SectionService,
    private projectService: ProjectService
  ) {}

  @Post()
  async createSection(@Body(ValidationPipe) createSectionDto: CreateSectionDto) {
    const checkSection = await this.sectionService.getSectionByName(createSectionDto.name, createSectionDto.projectId);
    if (checkSection) throw new BadRequestException(`Section with "${createSectionDto.name}" exists in project`);

    const projectCheck = await this.projectService.getProjectById(createSectionDto.projectId);
    if (!projectCheck) throw new BadRequestException(`Project with "${createSectionDto.projectId}" not founded`);
    
    const section = await this.sectionService.createNewSection(createSectionDto);
    return transformWithExclude(section, SectionOut);
  }
}