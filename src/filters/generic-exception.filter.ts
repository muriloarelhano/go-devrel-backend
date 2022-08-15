import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from "fastify";
import { hostname } from 'os'

@Catch(HttpException)
export class GenericHttpExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger
  constructor(private readonly applicationContext: string) {
    this.logger = new Logger(applicationContext)
  }
  catch(exception: HttpException, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const context = host.switchToHttp()
    const response = context.getResponse<FastifyReply>()
    const request = context.getRequest<FastifyRequest>()
    const status = exception.getStatus();

    this.logger.error(
      {
        path: request.url,
        method: request.method,
        host: hostname(),
        description: exception.getResponse(),
      },
      exception.stack,
      this.applicationContext
    )
    
    response.status(status).send({
      path: request.url,
      method: request.method,
      description: exception.getResponse(),
    })
  }
}
