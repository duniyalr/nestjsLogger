import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateSectionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  projectId?: string;
}