import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class UserModule {}
