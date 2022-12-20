import { Body, Controller, Get, Post, Query, UseFilters, ValidationPipe } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GenericHttpExceptionsFilter } from '../filters/generic-exception.filter'
import { AuthenticationService } from './authentication.service'
import {
  AuthenticationDto, ReturnAuthenticatedCredentialsDto, ValidateEmailTokenDto
} from './dto/authentication.dto'

@ApiTags("Auth")
@Controller('auth')
@UseFilters(new GenericHttpExceptionsFilter(AuthenticationController.name))
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Get('login')
  login(@Query(new ValidationPipe()) payload: AuthenticationDto) {
    return this.authenticationService.login(payload)
  }

  @Get('logout')
  logout(@Query(new ValidationPipe()) payload: ReturnAuthenticatedCredentialsDto) {
    return this.authenticationService.logout(payload)
  }

  @Get('refresh')
  refresh(@Query(new ValidationPipe()) payload: ReturnAuthenticatedCredentialsDto) {
    return this.authenticationService.refresh(payload)
  }

  @Post('email/validate/:token')
  validateEmail(@Body(new ValidationPipe()) { token }: ValidateEmailTokenDto) {
    return this.authenticationService.validateEmail(token)
  }

  @Post('email/resend')
  resendConfirmationEmail(@Body('email') email: string) {
    return this.authenticationService.resendConfirmationEmail(email)
  }
}
