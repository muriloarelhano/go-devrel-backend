import { Module } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { AuthenticationController } from './authentication.controller'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtConfigOptions } from 'src/infrastructure/config/jwt.config'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigOptions,
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
