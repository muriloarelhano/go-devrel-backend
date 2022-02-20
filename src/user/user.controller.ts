import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AllExceptionsFilter } from '../filters/generic-exception.filter'
import { JwtAuthGuard } from '../authentication/guards/jwt.guard'

@Controller('user')
@UseFilters(new AllExceptionsFilter(UserController.name))
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: any) {
    return this.userService.findOne(req.user.email)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: any) {
    return this.userService.remove(req.user.id)
  }
}
