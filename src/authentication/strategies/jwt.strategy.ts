import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync(
        join(
          __dirname,
          '..',
          '..',
          'configuration',
          'keys',
          'jwt_key.pub',
        ).toString(),
      ),
    })
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, ...payload }
  }
}
