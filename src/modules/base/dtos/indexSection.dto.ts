import { IsEnum, IsOptional, IsString } from "class-validator";
import { IndexDto } from "./index.dto";

export enum IndexSectionSortBy {
  CREATED_AT = "createdAt",
  PROJECT_ID = "projectId"
}

export class IndexSectionDto extends IndexDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsEnum(IndexSectionSortBy)
  @IsOptional()
  sortBy: IndexSectionSortBy = IndexSectionSortBy.CREATED_AT
}