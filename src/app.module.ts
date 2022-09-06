import { MiddlewareConsumer, Module, NestModule, RequestMethod,  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './modules/session/entities/session.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { UtilModule } from './modules/util/util.module';
import { BaseModule } from './modules/base/base.module';
import { GetUserMiddleware } from './modules/base/middlewares/getUser.middleware';
import { SessionModule } from './modules/session/session.module';
import { ProjectModule } from './modules/project/project.module';
import { Project } from './modules/project/entities/project.entity';
import { SectionModule } from './modules/section/section.module';
import { Section } from './modules/section/entities/section.entities';
import { Log } from './modules/log/entities/log.entity';
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MiddlewareExceptionFilter } from './modules/base/filters/middleware.filter';
import { LogModule } from './modules/log/log.module';
import ResponseTransformInterceptor from './modules/base/interceptors/responseTransform.interceptor';

@Module({
  imports: [
    SessionModule,
    BaseModule,
    UtilModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "loggerbynest",
      entities: [
        User,
        Session,
        Project,
        Section,
        Log
      ],
      synchronize: true
    }),
    UserModule,
    ProjectModule,
    SectionModule,
    LogModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: MiddlewareExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor
    }
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(GetUserMiddleware)
        .exclude(
          { path: "/api/auth/login", method: RequestMethod.POST }
        )
        .forRoutes("*")
  }
}
