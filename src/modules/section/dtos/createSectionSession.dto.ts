import { IsString, IsNotEmpty } from "class-validator";

export default class CreateSectionSessionDto {
  @IsString()
  @IsNotEmpty() 
  sectionId: string;
}