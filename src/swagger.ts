import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { FastifyInstance } from 'fastify'

const DOC_ENDPOINT = 'docs/api'

export const setUpSwagger = (
    app: NestFastifyApplication,
    server: FastifyInstance
) => {

    server.after(() => {
        server.addHook('onRoute', (opts) => {
            if (opts.url.indexOf(`/${DOC_ENDPOINT}`) === 0) {
                opts.preValidation = server.basicAuth

            }
        })

    })


    const config = new DocumentBuilder()
        .setTitle('Go Devrel Internal API')
        .setDescription('The app internal API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(DOC_ENDPOINT, app, document)
}