import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { MailModule } from 'src/mail/mail.module'
import { JwtConfigOptions } from 'src/configuration/jwt.config'
import { JwtModule } from '@nestjs/jwt'
import { POSTGRES_CONNECTION } from 'src/constants'

@Module({
  imports: [
    TypeOrmModule.forFeature([User], POSTGRES_CONNECTION),
    JwtModule.registerAsync({
      useClass: JwtConfigOptions,
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
