import { Param, Post, ValidationPipe } from '@nestjs/common'
import { Controller, Get, Body, UseFilters } from '@nestjs/common'
import { AllExceptionsFilter } from '../filters/generic-exception.filter'
import { AuthenticationService } from './authentication.service'
import {
  AuthenticatedDto,
  AuthenticationDto,
  ValidationDto,
} from './dto/authentication.dto'

@Controller('auth')
@UseFilters(new AllExceptionsFilter(AuthenticationController.name))
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('login')
  login(@Body(new ValidationPipe()) body: AuthenticationDto) {
    return this.authenticationService.login(body)
  }

  @Get('logout')
  logout(@Body(new ValidationPipe()) body: AuthenticatedDto) {
    return this.authenticationService.logout(body)
  }

  @Get('refresh')
  refresh(@Body(new ValidationPipe()) body: AuthenticatedDto) {
    return this.authenticationService.refresh(body)
  }

  @Post('validate/email/:token')
  validateEmail(@Param(new ValidationPipe()) { token }: ValidationDto) {
    return this.authenticationService.validateEmail(token)
  }

  @Post('resend/email')
  resendConfirmationEmail(@Body('email') email: string) {
    return this.authenticationService.resendConfirmationEmail(email)
  }
}
