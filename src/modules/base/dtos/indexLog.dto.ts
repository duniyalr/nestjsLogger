import { IsString, IsOptional, IsEnum } from "class-validator";
import { IndexDto } from "./index.dto";

export enum IndexLogSortBy {
  CREATED_AT = "createdAt",
  SECTION_ID = "sectionId",
  PROJECT_ID = "projectId"
}

export class IndexLogDto extends IndexDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  sectionId?: string;

  @IsEnum(IndexLogSortBy)
  @IsOptional()
  sortBy: IndexLogSortBy = IndexLogSortBy.CREATED_AT
}