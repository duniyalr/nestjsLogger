import { Controller, Post, UseGuards, Body, ValidationPipe } from "@nestjs/common";
import { GetUser } from "../base/decorators/getUser.decorator";
import { SuccessDto } from "../base/dtos/success.dto";
import { UserGuard } from "../base/guards/user.guard";
import { User } from "../user/entities/user.entity";
import { CreateLogDto } from "./dtos/createLog.dto";
import { LogService } from "./log.service";
@Controller("log")
export class LogController {
  constructor(
    private logService: LogService
  ) {}

  @Post()
  @UseGuards(UserGuard)
  async createLog(@Body(ValidationPipe) createLogDto: CreateLogDto, @GetUser() user: User) {
    const log = await this.logService.createLog(createLogDto, user);
    console.log(log);
    return new SuccessDto();
  }
}