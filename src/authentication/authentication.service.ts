import {
  BadRequestException,
  Injectable,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common'
import { ERROR_INVALID_CREDENTIALS, ERROR_INVALID_TOKEN } from 'src/constants'
import { UserService } from 'src/user/user.service'
import { AuthenticatedDto, AuthenticationDto } from './dto/authentication.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { DateTime } from 'luxon'
import { Cache } from 'cache-manager'
import { UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(body: AuthenticationDto) {
    const user = await this.validateUser(body.email, body.password)
    if (!user) throw new BadRequestException(ERROR_INVALID_CREDENTIALS)
    const payload = {
      email: user.email,
      sub: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    }
    const generatedToken = this.generateRefreshToken()

    const response = {
      id_token: this.jwtService.sign(payload),
      refresh_token: generatedToken.token,
    }

    await this.cacheManager.set(generatedToken.token, generatedToken.expireDate)
    return response
  }

  async logout(_body: AuthenticatedDto) {
    return `This action is not implemented yet`
  }

  async refresh(body: AuthenticatedDto) {
    const isTokenValid = await this.verifyRefreshToken(body.refresh_token)
    if (!isTokenValid) throw new UnauthorizedException(ERROR_INVALID_TOKEN)

    const generatedToken = this.generateRefreshToken()

    await this.cacheManager.del(body.refresh_token)
    await this.cacheManager.set(generatedToken.token, generatedToken.expireDate)

    const loggedUserPayload = this.jwtService.decode(body.id_token) as any

    const user = await this.userService.findOne(loggedUserPayload.email)

    const payload = {
      email: user.email,
      sub: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    }

    const response = {
      id_token: this.jwtService.sign(payload),
      refresh_token: generatedToken.token,
    }

    return response
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email)
    if (user && bcrypt.compareSync(password, user.password)) return user
  }

  private generateRefreshToken() {
    return {
      token: crypto.randomBytes(32).toString('hex'),
      expireDate: DateTime.now().plus({ days: 5 }).toISO(),
    }
  }

  private async verifyRefreshToken(payloadToken: string): Promise<boolean> {
    const response: any = await this.cacheManager.get<any>(payloadToken)
    if (!response) return false
    if (DateTime.fromISO(response).toMillis() < DateTime.now().toMillis())
      return false
    return true
  }
}
