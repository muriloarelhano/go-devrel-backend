import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { isEmpty } from "lodash";
import { JwtAuthGuard } from "src/authentication/guards/jwt.guard";
import { ERROR_ID_IS_REQUIRED } from "src/constants";
import { GenericHttpExceptionsFilter } from "src/filters/generic-exception.filter";
import { UserRoles } from "src/user/roles/role.enum";
import { Roles } from "src/user/roles/roles.decorator";
import { RolesGuard } from "src/user/roles/roles.guard";
import { CreateFormDto } from "./dto/create-form.dto";
import { ExportFormDto } from "./dto/export-form.dto";
import { FormsService } from "./forms.service";
import { ExportFormatTypes } from "./interfaces";
import { ExportAllFormsDto } from "./dto/export-all-forms.dto";

@ApiTags("Forms")
@UseFilters(new GenericHttpExceptionsFilter(FormsController.name))
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("forms")
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    })
  )
  create(@Body() createFormDto: CreateFormDto, @Req() req: any) {
    return this.formsService.create(req.user.id, createFormDto);
  }

  @Get("admin/export")
  @Roles(UserRoles.Admin)
  findAll(@Query(new ValidationPipe()) params: ExportAllFormsDto) {
    return this.formsService.exportAllByDateInterval(params);
  }

  @Get()
  findByUser(@Req() req: any) {
    return this.formsService.findByUser(req.user.id);
  }

  @Get("export")
  exportByDate(
    @Req() req: any,
    @Query(new ValidationPipe()) params: ExportFormDto
  ) {
    if (isEmpty(req.user.id))
      throw new BadRequestException(ERROR_ID_IS_REQUIRED);
    return this.formsService.exportByDateInterval(req.user.id, params);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.formsService.findOne(id);
  }

  @Get("export/:formId")
  @UsePipes(new ValidationPipe())
  exportOne(
    @Req() req: any,
    @Param("formId") formId: string,
    @Query("format", new ParseEnumPipe(ExportFormatTypes))
    format: ExportFormatTypes
  ) {
    return this.formsService.exportOne(req.user.id, formId, format);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.formsService.remove(id);
  }
}
