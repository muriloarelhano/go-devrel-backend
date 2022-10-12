import compression from "@fastify/compress";
import helmet from "@fastify/helmet";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { setUpSwagger } from "./swagger";
import basicAuth from "@fastify/basic-auth";
import { ERROR_INVALID_CREDENTIALS } from "./constants";
import { UnauthorizedException } from "@nestjs/common";

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

  await app.register(basicAuth, {
    validate,
    authenticate: { realm: "internal_doc" },
  });

  function validate(username, password, req, reply, done) {
    if (username === "secretuser" && password === "secretpassword") {
      done();
    } else {
      done(new UnauthorizedException(ERROR_INVALID_CREDENTIALS));
    }
  }

  setUpSwagger(app, app.getHttpAdapter().getInstance());

  await app.listen(process.env.PORT || 4000, "0.0.0.0");
}

bootstrap();
