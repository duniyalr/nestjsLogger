import { Module } from "@nestjs/common";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";

@Module({
  providers: [LogService],
  controllers: [LogController]
})
export class LogModule {}