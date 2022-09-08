import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IndexDto } from "./index.dto";

export class IndexSectionSessionDto extends IndexDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  projectId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sectionId?: string;
}