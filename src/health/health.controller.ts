import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckService
} from "@nestjs/terminus/dist/health-check";
import { TypeOrmHealthIndicator } from "@nestjs/terminus/dist/health-indicator";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "nodemailer/lib/mailer";
import { MONGODB_CONNECTION, POSTGRES_CONNECTION } from "src/constants";

@ApiTags('Helpers')
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator, 
    @InjectConnection(MONGODB_CONNECTION)
    private mongo: Connection,
    @InjectConnection(POSTGRES_CONNECTION)
    private postgres: Connection,
  ) {}

  @Get("")
  @HealthCheck()
  create() {
    return this.health.check([
      () => this.db.pingCheck('mongdb', { connection: this.mongo }),
      () => this.db.pingCheck('postgres', { connection: this.postgres }),
    ]);
  }
}
