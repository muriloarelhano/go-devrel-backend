import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { MailModule } from "./mail/mail.module";
import { FormsModule } from "./forms/forms.module";
import { MONGODB_CONNECTION, POSTGRES_CONNECTION } from "./constants";
import { TypeOrmConfigOptions } from "./configuration/database/typeorm.config";
import { MongodbTypeOrmConfigOptions } from "./configuration/database/mongodb.config";
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      name: POSTGRES_CONNECTION,
      useClass: TypeOrmConfigOptions,
    }),
    TypeOrmModule.forRootAsync({
      name: MONGODB_CONNECTION,
      useClass: MongodbTypeOrmConfigOptions,
    }),
    AuthenticationModule,
    UserModule,
    MailModule,
    FormsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
