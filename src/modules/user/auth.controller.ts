import { Body, Controller, Post, ValidationPipe, BadRequestException, UnauthorizedException, UseGuards, Query, Get, Res } from "@nestjs/common";
import { hashPassword, validatePassword } from "../../helpers/auth.helper";
import { transformWithExclude } from "../../helpers/transform.helper";
import { AuthService } from "./auth.service";
import { AuthRegisterDto } from "./dtos/authRegister.dto";
import { Expose } from "class-transformer";
import { AuthLoginDto } from "./dtos/authLogin.dto";
import { SessionService } from "../session/session.service";
import { User } from "./entities/user.entity";
import { RegisterAdminGuard } from "./guards/registerAdmin.guard";
import { GetUser } from "../base/decorators/getUser.decorator";
import { Role } from "../base/entities/role.enum";
import { Response } from "express";
import { ConfigService } from "../base/config.service";

class UserOut {
  @Expose() id: string;
  @Expose() username: string;
  @Expose() email: string;
  @Expose() createdAt: Date;
  @Expose() role: Role;
}

class SessionOut {
  @Expose() session: string;
}


@Controller("/auth")
export class AuthController {
  constructor (
    private authService: AuthService,
    private sessionService: SessionService,
    private configService: ConfigService
  ) {}

  @Get("who")
  async who(@GetUser() user: User) {
    if(!user) return new UnauthorizedException("You are not logged in");

    return transformWithExclude(user, UserOut);
  }

  @Post("registerAdmin")
  @UseGuards(RegisterAdminGuard)
  async registerAdmin(@Body(ValidationPipe) authRegisterDto: AuthRegisterDto) {
    const checkUser = await this.authService.findUserByUsernameOrEmail({
      username: authRegisterDto.username,
      email: authRegisterDto.email
    });

    if (checkUser) throw new BadRequestException();

    const { salt, hash } = await hashPassword(authRegisterDto.password);
    const user = await this.authService.createAdmin({
      username: authRegisterDto.username,
      email: authRegisterDto.email,
      password: hash,
      salt
    });

    const out = transformWithExclude(user, UserOut);
    return out;
  }

  @Post("register")
  async register(@Body(ValidationPipe) authRegisterDto: AuthRegisterDto) {
    const checkUser = await this.authService.findUserByUsernameOrEmail({
      username: authRegisterDto.username,
      email: authRegisterDto.email
    });

    if (checkUser) throw new BadRequestException();

    const {salt, hash} = await hashPassword(authRegisterDto.password);
    const user = await this.authService.createNewUser({
      username: authRegisterDto.username,
      email: authRegisterDto.email,
      password: hash,
      salt
    });

    const out = transformWithExclude(user, UserOut);
    return out;
  }

  @Post("login")
  async login(@Body(ValidationPipe) authLoginDto: AuthLoginDto, @Res({passthrough: true}) response: Response) {
    // only one session per user at this point is allowed
    const user: User = await this.authService.findUserByUsernameOrEmail({username: authLoginDto.username});
    if (!user) throw new BadRequestException("User not Founded");
    const passwordCheck = await validatePassword(authLoginDto.password, user.password, user.salt);

    if (!passwordCheck) throw new UnauthorizedException();

    // returns by expiredAt order Desc
    const prevSessions = await this.sessionService.getSessionsByUser(user);
    if (prevSessions.length) {
      if (prevSessions[0].expiredAt < new Date()) {
        // removing old sessions
        await this.sessionService.removeExpiredSessionsByUser(user);
      } else {
          response.cookie(this.configService.sessionHeaderKey, prevSessions[0].session) ;
        return transformWithExclude(prevSessions[0], SessionOut);
      }
    }
    const session = await this.sessionService.createNewSession(user);
    response.cookie(this.configService.sessionHeaderKey, session.sessoin);

    const out = transformWithExclude(session, SessionOut);
    return out;
  } 
} 