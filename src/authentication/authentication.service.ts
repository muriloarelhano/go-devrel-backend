/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";
import { isEmpty } from "class-validator";
import * as crypto from "crypto";
import { DateTime, DurationLike } from "luxon";
import {
  ERROR_EMAIL_NOT_FOUND,
  ERROR_INVALID_CREDENTIALS,
  ERROR_INVALID_TOKEN,
  SUCCESSFULLY_VALIDATED,
} from "src/constants";
import { MailService } from "src/mail/mail.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import {
  AuthenticationDto,
  ReturnAuthenticatedCredentialsDto,
} from "./dto/authentication.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  private makeTokenPayload(user: User) {
    return {
      email: user.email,
      sub: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      isEmailValidated: user.is_email_verified,
      phone: user.phone,
      role: user.role,
    };
  }

  async login(body: AuthenticationDto) {
    let user: User;
    try {
      user = await this.validateUser(body.email, body.password);
    } catch (error) {
      throw new BadRequestException(ERROR_INVALID_CREDENTIALS);
    }

    if (!user) throw new BadRequestException(ERROR_INVALID_CREDENTIALS);

    const payload: any = this.makeTokenPayload(user);

    if (!isEmpty(user.birthdate)) payload.birthdate = user.birthdate;

    const generatedRefreshToken = this.generateRefreshToken({ days: 5 });

    const response = {
      id_token: this.jwtService.sign(payload),
      refresh_token: generatedRefreshToken.token,
    };

    await this.cacheManager.set(
      generatedRefreshToken.token,
      generatedRefreshToken.expireDate
    );
    return response;
  }

  async logout(_body: ReturnAuthenticatedCredentialsDto) {
    return `This action is not implemented yet`;
  }

  async resendConfirmationEmail(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) throw new NotFoundException(ERROR_EMAIL_NOT_FOUND);

    return this.mailService.sendConfirmationEmail(
      user,
      this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: "2d" }
      )
    );
  }

  async validateEmail(token: string): Promise<{ [key: string]: any }> {
    if (!(await this.jwtService.verifyAsync(token)))
      throw new BadRequestException(ERROR_INVALID_TOKEN);

    const payload = this.jwtService.decode(token);

    //@ts-ignore
    const user = await this.userService.findOne(payload.email);

    if (!user) new NotFoundException(ERROR_EMAIL_NOT_FOUND);

    await this.userService.update(user.id, { is_email_verified: true });
    return { status: SUCCESSFULLY_VALIDATED };
  }

  async refresh(body: ReturnAuthenticatedCredentialsDto) {
    const isTokenValid = await this.verifyRefreshToken(body.refresh_token);
    if (!isTokenValid) throw new UnauthorizedException(ERROR_INVALID_TOKEN);

    const generatedRefreshToken = this.generateRefreshToken({ days: 5 });

    await this.cacheManager.del(body.refresh_token);
    await this.cacheManager.set(
      generatedRefreshToken.token,
      generatedRefreshToken.expireDate
    );

    const loggedUserPayload = this.jwtService.decode(body.id_token) as any;

    const user = await this.userService.findOne(loggedUserPayload.email);

    const payload: any = this.makeTokenPayload(user);

    if (!isEmpty(user.birthdate)) payload.birthdate = user.birthdate;

    const response = {
      id_token: this.jwtService.sign(payload),
      refresh_token: generatedRefreshToken.token,
    };

    return response;
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (user && !isEmpty(user) && bcrypt.compareSync(password, user.password))
      return user;
    else throw new UnauthorizedException(ERROR_INVALID_CREDENTIALS);
  }

  private generateRefreshToken(duration: DurationLike) {
    return {
      token: crypto.randomBytes(32).toString("hex"),
      expireDate: DateTime.now().plus(duration).toISO(),
    };
  }

  private async verifyRefreshToken(payloadToken: string): Promise<boolean> {
    const response: any = await this.cacheManager.get<any>(payloadToken);
    if (!response) return false;
    if (DateTime.fromISO(response).toMillis() < DateTime.now().toMillis())
      return false;
    return true;
  }
}
