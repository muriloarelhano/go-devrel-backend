import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { hostname } from 'os'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger
  constructor(private readonly applicationContext: string) {
    this.logger = new Logger(applicationContext)
  }
  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    this.logger.error(
      {
        statusCode: exception.response ? undefined : status,
        error: exception.response ? undefined : exception.error,
        message: exception.response ? undefined : exception.message,
        ...exception.response,
        path: request.url,
        method: request.method,
        host: hostname(),
      },
      exception.stack,
    )
    response.status(status).json({
      statusCode: exception.response ? undefined : status,
      error: exception.response ? undefined : exception.error,
      message: exception.response ? undefined : exception.message,
      ...exception.response,
      path: request.url,
      method: request.method,
    })
  }
}
