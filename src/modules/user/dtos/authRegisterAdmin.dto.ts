import { IsNotEmpty, IsString } from "class-validator";

export class RegisterAdminDto {
  @IsString()
  @IsNotEmpty()
  secret: string;
}