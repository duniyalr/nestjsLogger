import { IsNotEmpty, IsString } from "class-validator";

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;  

  @IsString()
  @IsNotEmpty()
  name: string;
}