import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { GenericHttpExceptionsFilter } from "src/filters/generic-exception.filter";
import { CreateFormDto } from "./dto/create-form.dto";
import { ExportFormDto } from "./dto/export-form.dto";
import { FindFormDto } from "./dto/find-form.dto";
import { FormsService } from "./forms.service";

@ApiTags("Forms")
@Controller("forms")
@UseFilters(new GenericHttpExceptionsFilter(FormsController.name))
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  findByUser(@Req() req: any) {
    return this.formsService.findByUser(req.user.id);
  }

  @Get("export")
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  exportByDate(@Req() req: any, @Param() params: ExportFormDto) {
    return this.formsService.export(req.user.id, params);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string) {
    return this.formsService.findOne(id);
  }

  @Get(":id/export")
  @UseGuards(JwtAuthGuard)
  exportOne(@Param("id") id: string) {
    return this.formsService.export(id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string) {
    return this.formsService.remove(id);
  }
}
