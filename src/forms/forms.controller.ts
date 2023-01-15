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
import { JwtAuthGuard } from "src/authentication/guards/jwt.guard";
import { ERROR_ID_IS_REQUIRED } from "src/constants";
import { GenericHttpExceptionsFilter } from "src/filters/generic-exception.filter";
import { CreateFormDto } from "./dto/create-form.dto";
import { ExportFormDto } from "./dto/export-form.dto";
import { FindFormDto } from "./dto/find-form.dto";
import { FormsService } from "./forms.service";
import { ExportFormatTypes } from "./interfaces";
import { isEmpty } from "lodash";

@ApiTags("Forms")
@UseFilters(new GenericHttpExceptionsFilter(FormsController.name))
@UseGuards(JwtAuthGuard)
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

  @Get("admin/all")
  findAll(@Query() formDto: FindFormDto) {
    return this.formsService.findAll(formDto);
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
