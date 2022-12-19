import { Module } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from './health.controller';
@ApiTags("Helpers")
@Module({
    imports: [TerminusModule],
    controllers: [HealthController]
})
export class HealthModule {}
