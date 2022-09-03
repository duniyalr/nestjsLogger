import { IsString, MinLength, IsEmail, IsNotEmpty } from "class-validator";

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}