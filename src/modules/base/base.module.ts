import { Module, Global } from "@nestjs/common";
import { SectionModule } from "../section/section.module";
import { ConfigService } from "./config.service";

@Global()
@Module({
  imports: [SectionModule],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class BaseModule {}