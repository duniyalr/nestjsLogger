import { Controller, Post, UseGuards } from "@nestjs/common";
import { UserGuard } from "../base/guards/user.guard";
@Controller("log")
export class LogController {
  constructor() {}

  @Post()
  @UseGuards(UserGuard)
  async createLog() {
    console.log("here")
  }
}