import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "@fastify/helmet";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true }
  );
  await app.register(helmet);
  await app.listen(process.env.PORT || 4000, '0.0.0.0');

  const logger = new Logger('NestApplication');
  logger.log(`Server is running on port: ${process.env.PORT || 4000}`)

}
bootstrap();
