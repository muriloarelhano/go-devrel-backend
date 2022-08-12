import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  ValidationPipe,
  UsePipes,
  UseFilters,
  UseGuards,
  Req,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AllExceptionsFilter } from "../filters/generic-exception.filter";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("User")
@Controller("user")
@UseFilters(new AllExceptionsFilter(UserController.name))
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: any) {
    return this.userService.findOne(req.user.email);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Put("reset-password")
  @UseGuards(JwtAuthGuard)
  resetPassword(
    @Req() req: any,
    @Body("password") password: string,
    @Body("newPassword") newPassword: string
  ) {
    return this.userService.resetPassword(req.user.id, password, newPassword);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: any) {
    return this.userService.remove(req.user.id);
  }
}
