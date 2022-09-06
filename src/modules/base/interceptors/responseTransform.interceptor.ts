import { Injectable, NestInterceptor, ExecutionContext, CallHandler} from "@nestjs/common";
import { Observable } from "rxjs";
import {map} from "rxjs/operators";

export interface Response<T> {
  success: boolean,
  statusCode: number;
  timestamp: number;
  data: T;
}

@Injectable()
export default class ResponseTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(map((data) => {
      return {
        success: true, // it is always true!
        statusCode: response.statusCode,
        timestamp: Date.now(),
        data: data,
      }
    }));
  }
}