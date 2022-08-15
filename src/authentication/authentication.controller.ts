import {  Param, Post, ValidationPipe } from '@nestjs/common'
import { Controller, Get, Body, UseFilters } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GenericHttpExceptionsFilter } from '../filters/generic-exception.filter'
import { AuthenticationService } from './authentication.service'
import {
  ReturnAuthenticatedCredentialsDto,
  AuthenticationDto,
  ValidateEmailTokenDto,
} from './dto/authentication.dto'

@ApiTags("Auth")
@Controller('auth')
@UseFilters(new GenericHttpExceptionsFilter(AuthenticationController.name))
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('login')
  login(@Body(new ValidationPipe()) body: AuthenticationDto) {
    return this.authenticationService.login(body)
  }

  @Get('logout')
  logout(@Body(new ValidationPipe()) body: ReturnAuthenticatedCredentialsDto) {
    return this.authenticationService.logout(body)
  }

  @Get('refresh')
  refresh(@Body(new ValidationPipe()) body: ReturnAuthenticatedCredentialsDto) {
    return this.authenticationService.refresh(body)
  }

  @Post('email/validate/:token')
  validateEmail(@Param(new ValidationPipe()) { token }: ValidateEmailTokenDto) {
    return this.authenticationService.validateEmail(token)
  }

  @Post('email/resend')
  resendConfirmationEmail(@Body('email') email: string) {
    return this.authenticationService.resendConfirmationEmail(email)
  }
}
