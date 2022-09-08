import { Controller, Post, UseGuards, Body, ValidationPipe, Get, UsePipes, Query } from "@nestjs/common";
import { Expose, Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { transformWithExclude } from"../../helpers/transform.helper";
import { GetSection } from "../base/decorators/getSection.decorator";
import { GetUser } from "../base/decorators/getUser.decorator";
import { IndexLogDto } from "../base/dtos/indexLog.dto";
import { SuccessDto } from "../base/dtos/success.dto";
import { AdminGuard } from "../base/guards/Admin.guard";
import { SectionGuard } from "../base/guards/section.guard";
import { UserGuard } from "../base/guards/user.guard";
import { Section } from "../section/entities/section.entity";
import { SectionOut } from "../section/section.controller";
import { User } from "../user/entities/user.entity";
import { ContentType, CreateLogDto } from "./dtos/createLog.dto";
import { Log } from "./entities/log.entity";
import { LogService } from "./log.service";

export class LogOut {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() url: string;
  @Expose() ip: string;
  @Expose() content: string;
  @Expose() contentType: ContentType;
  @Type(() => SectionOut)
  @Expose() section: SectionOut
}
@Controller("log")
export class LogController {
  constructor(
    private logService: LogService
  ) {}

  @Post()
  @UseGuards(SectionGuard)
  async createLog(@Body(ValidationPipe) createLogDto: CreateLogDto, @GetSection() section: Section) {
    const log = await this.logService.createLog(createLogDto, section);
    return new SuccessDto();
  }

  @Get("index")
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({transform: true}))
  async index(@Query() indexLogDto: IndexLogDto) {
    const indexPageDto = await this.logService.index(indexLogDto);
    indexPageDto.items = transformWithExclude(indexPageDto.items, LogOut) as Log[];
    return indexPageDto;  
  }
}