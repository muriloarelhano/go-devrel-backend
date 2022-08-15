import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guards/jwt.guard';
import { GenericHttpExceptionsFilter } from 'src/filters/generic-exception.filter';
import { CreateFormDto } from './dto/create-form.dto';
import { FindFormDto } from './dto/find-form.dto';
import { FormsService } from './forms.service';

@ApiTags("Forms")
@Controller('forms')
@UseFilters(new GenericHttpExceptionsFilter(FormsController.name))
export class FormsController {
  constructor(private readonly formsService: FormsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body(new ValidationPipe()) createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get('admin/all')
  findAll(@Query() formDto: FindFormDto) {
    return this.formsService.findAll(formDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByUser(@Req() req: any) {
    return this.formsService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.formsService.remove(id);
  }
}
