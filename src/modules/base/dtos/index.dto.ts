import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";
export enum ORDER {
  ASC = "ASC",
  DESC = "DESC"
}

export class IndexDto {
  sortBy: string = "createdAt"

  @IsEnum(ORDER)
  @IsOptional()
  sortOrder?: ORDER = ORDER.DESC

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  q?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  take?: number = 10;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}