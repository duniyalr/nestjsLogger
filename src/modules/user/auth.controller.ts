import { Body, Controller, Post, ValidationPipe, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { hashPassword, validatePassword } from "../../helpers/auth.helper";
import { transformWithExclude } from "../../helpers/transform.helper";
import { AuthService } from "./auth.service";
import { AuthRegisterDto } from "./dtos/authRegister.dto";
import { Expose } from "class-transformer";
import { AuthLoginDto } from "./dtos/authLogin.dto";
import { SessionService } from "../session/session.service";
import { User } from "./entities/user.entity";


class UserOut {
  @Expose() id: string;
  @Expose() username: string;
  @Expose() email: string;
  @Expose() createdAt: Date;
}

class SessionOut {
  @Expose() session: string;
}


@Controller("/auth")
export class AuthController {
  constructor (
    private authService: AuthService,
    private sessionService: SessionService
  ) {}

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
  async login(@Body(ValidationPipe) authLoginDto: AuthLoginDto) {
    // only one session per user at this point is allowed
    const user: User = await this.authService.findUserByUsernameOrEmail({username: authLoginDto.username});
    const passwordCheck = await validatePassword(authLoginDto.password, user.password, user.salt);

    if (!passwordCheck) throw new UnauthorizedException();

    // returns by expiredAt order Desc
    const prevSessions = await this.sessionService.getSessionsByUser(user);
    if (prevSessions.length) {
      if (prevSessions[0].expiredAt < new Date()) {
        // removing old sessions
        await this.sessionService.removeExpiredSessionsByUser(user);
      } else {
        return transformWithExclude(prevSessions[0], SessionOut);
      }
    }
    const session = await this.sessionService.createNewSession(user);

    const out = transformWithExclude(session, SessionOut);
    return out;
  } 
} 