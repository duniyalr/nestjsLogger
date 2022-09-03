import { Module } from "@nestjs/common";
import { ProjectModule } from "../project/project.module";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";

@Module({
  imports: [ProjectModule],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService]
})
export class SectionModule {}