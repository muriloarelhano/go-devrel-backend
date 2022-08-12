import compression from '@fastify/compress';
import helmet from "@fastify/helmet";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from "./app.module";


async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true }
  );

  await app.register(compression);
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Go Devrel Internal API')
    .setDescription('The app internal API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document)


  await app.listen(process.env.PORT || 4000, '0.0.0.0');

}

bootstrap();
