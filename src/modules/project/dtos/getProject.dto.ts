import { IsNotEmpty, IsString } from "class-validator";

export class GetProjectDto{
  @IsString()
  @IsNotEmpty()
  projectId: string;
}