import { ERROR_INVALID_CREDENTIALS } from 'src/constants';
import { BadRequestException, Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { AuthenticationDto } from './dto/authentication.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email)
    if (user && bcrypt.compareSync(password, user.password)) return user
  }

  async login(body: AuthenticationDto) {
    const user = await this.validateUser(body.email, body.password)
    if (!user) throw new BadRequestException(ERROR_INVALID_CREDENTIALS)
    const payload = { email: user.email, sub: user.id }
    return {
      id_token: this.jwtService.sign(payload),
      ...user
    }
  }

  async logout(body: AuthenticationDto) {
    return `This action is not implemented yet`
  }
}
