import { plainToInstance } from "class-transformer"

export const transformWithExclude = (plain: any, schema: any) => {
  return plainToInstance(schema, plain, {excludeExtraneousValues: true});
}