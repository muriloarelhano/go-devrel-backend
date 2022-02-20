import { Controller, Get, Body, UseFilters } from '@nestjs/common'
import { AllExceptionsFilter } from '../filters/generic-exception.filter'
import { AuthenticationService } from './authentication.service'
import { AuthenticationDto } from './dto/authentication.dto'

@Controller('auth')
@UseFilters(new AllExceptionsFilter(AuthenticationController.name))
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('login')
  login(@Body() body: AuthenticationDto) {
    return this.authenticationService.login(body)
  }

  @Get('logout')
  logout(@Body() body: AuthenticationDto) {
    return this.authenticationService.logout(body)
  }
}
