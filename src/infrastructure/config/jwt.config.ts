import { Injectable } from '@nestjs/common'
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt'
import { readFileSync } from 'fs'
import { join } from 'path'

@Injectable()
export class JwtConfigOptions implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      privateKey: readFileSync(
        join(__dirname, '..', 'keys', 'jwt_key.pem').toString(),
      ),
      publicKey: readFileSync(
        join(__dirname, '..', 'keys', 'jwt_key.pub').toString(),
      ),
      secretOrPrivateKey: readFileSync(
        join(__dirname, '..', 'keys', 'jwt_key.pem').toString(),
      ),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '6h',
      },
      verifyOptions: { algorithms: ['RS256'] },
    }
  }
}
