import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetSection = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().section;
  }
)