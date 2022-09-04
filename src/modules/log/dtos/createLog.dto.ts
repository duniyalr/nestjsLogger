import { IsEnum, IsIP, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export enum ContentType {
  JSON = "json",
  TEXT = "txt"
}

export class CreateLogDto {
  @IsUrl()
  url: string;

  @IsIP()
  ip: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(ContentType)
  @IsOptional()
  contentType: ContentType = ContentType.TEXT
}