import { CacheModule, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import * as redisStore from "cache-manager-redis-store";
import { JwtConfigOptions } from "src/configuration/jwt.config";
import { MailModule } from "src/mail/mail.module";
import { UserModule } from "src/user/user.module";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USER } = process.env;

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigOptions,
    }),
    UserModule,
    MailModule,
    CacheModule.register({
      store: redisStore,
      host: REDIS_HOST || "localhost",
      port: REDIS_PORT || 6379,
      password: REDIS_PASSWORD || "123",
      user: REDIS_USER || "default",
      isGlobal: true,
      ttl: 432000, // 5 days
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
