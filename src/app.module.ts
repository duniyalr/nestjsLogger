import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './modules/session/entities/session.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Base } from './modules/base/entities/base.entity';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { UtilModule } from './modules/util/util.module';
import { BaseModule } from './modules/base/base.module';

@Module({
  imports: [
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
        Session
      ],
      synchronize: true
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
