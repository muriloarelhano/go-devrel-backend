import { ValidationPipe } from '@nestjs/common'
import { Controller, Get, Body, UseFilters } from '@nestjs/common'
import { AllExceptionsFilter } from '../filters/generic-exception.filter'
import { AuthenticationService } from './authentication.service'
import { AuthenticatedDto, AuthenticationDto } from './dto/authentication.dto'

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
}
