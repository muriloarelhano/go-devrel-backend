import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigOptions } from "./infrastructure/config/typeorm.config";
import { UserModule } from "./user/user.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { MailModule } from "./mail/mail.module";
import { FormsModule } from './forms/forms.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigOptions,
    }),
    AuthenticationModule,
    UserModule,
    MailModule,
    FormsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
