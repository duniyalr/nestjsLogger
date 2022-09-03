import { plainToInstance } from "class-transformer"

export const transformWithExclude = (plain: any, schema: any) => {
  console.log(plain, schema)
  return plainToInstance(schema, plain, {excludeExtraneousValues: true});
}