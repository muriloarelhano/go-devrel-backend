import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { GenericHttpExceptionsFilter } from "../filters/generic-exception.filter";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoles } from "./roles/role.enum";
import { Roles } from "./roles/roles.decorator";
import { RolesGuard } from "./roles/roles.guard";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("user")
@UseFilters(new GenericHttpExceptionsFilter(UserController.name))
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

  @Post("admin/get-by-ids")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  async findManyById(@Body("ids") ids: string[]) {
    return this.userService.findManyByIds(ids);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: any,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Put("reset-password")
  @UseGuards(JwtAuthGuard)
  resetPassword(
    @Req() req: any,
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto
  ) {
    const { password, newPassword } = resetPasswordDto;
    return this.userService.resetPassword(req.user.id, password, newPassword);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: any) {
    return this.userService.remove(req.user.id);
  }
}
