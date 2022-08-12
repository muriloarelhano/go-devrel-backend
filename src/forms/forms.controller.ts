import { Body, Controller, Delete, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFormDto } from './dto/create-form.dto';
import { FindFormDto } from './dto/find-form.dto';
import { FormsService } from './forms.service';

@ApiTags("Forms")
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) { }

  @Post()
  create(@Body(new ValidationPipe()) createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get()
  findAll(@Query() formDto: FindFormDto) {
    return this.formsService.findAll(formDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formsService.remove(id);
  }
}
