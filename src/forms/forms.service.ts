import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmpty } from "class-validator";
import { DateTime } from "luxon";
import { ObjectID } from "mongodb";
import {
  ERROR_ID_IS_REQUIRED,
  FORM_INVALID_ID,
  FORM_NOT_FOUND,
  MONGODB_CONNECTION,
  SUCCESSFULLY_DELETED,
} from "src/constants";
import { MongoRepository } from "typeorm";
import { CreateFormDto } from "./dto/create-form.dto";
import { ExportFormDto } from "./dto/export-form.dto";
import { FindFormDto } from "./dto/find-form.dto";
import { Form } from "./entities/form.entity";
import { ExportFormatTypes } from "./interfaces";

@Injectable()
export class FormsService {
  findByUser(userId: string) {
    if (isEmpty(userId)) throw new BadRequestException(ERROR_ID_IS_REQUIRED);
    return this.findAll({ userId });
  }

  constructor(
    @InjectRepository(Form, MONGODB_CONNECTION)
    private readonly formsRepository: MongoRepository<Form>
  ) {}

  create(id: string, createFormDto: CreateFormDto) {
    return this.formsRepository.save({ userId: id, ...createFormDto });
  }

  exportByDateInterval(id: string, exportConfiguration?: ExportFormDto) {
    const { endDate, startDate } = exportConfiguration;
    return this.formsRepository.findBy({
      where: {
        userId: id,
        createdAt: {
          $gte: DateTime.fromISO(startDate).toJSDate(),
          $lt: DateTime.fromISO(endDate).toJSDate(),
        },
      },
      take: 10,
    });
  }

  exportOne(id: string, formId: string, _format: ExportFormatTypes) {
    return this.formsRepository.findOne({
      where: { userId: id, _id: new ObjectID(formId) },
    });
  }

  findAll(form: Partial<FindFormDto>) {
    const { afterDate, beforeDate, ...rest } = form;

    const query: any = rest;

    if (afterDate) query.createdAt = { $gte: new Date(afterDate) };
    if (beforeDate) query.createdAt = { $lte: new Date(beforeDate) };

    return this.formsRepository.find({ where: { ...query } });
  }

  async findOne(id: string) {
    let form: null | Form;
    try {
      form = await this.formsRepository.findOneBy({ _id: new ObjectID(id) });
    } catch (error) {
      throw new BadRequestException(FORM_INVALID_ID);
    }

    if (!form) throw new BadRequestException(FORM_NOT_FOUND);
    return this.formsRepository.findOneBy({ _id: new ObjectID(id) });
  }

  async remove(id: string) {
    let form: null | Form;
    try {
      form = await this.formsRepository.findOneBy({ _id: new ObjectID(id) });
    } catch (error) {
      throw new BadRequestException(FORM_INVALID_ID);
    }

    if (!form) throw new BadRequestException(FORM_NOT_FOUND);
    try {
      const response = await this.formsRepository.deleteOne(form);
      return {
        status: 200,
        message: SUCCESSFULLY_DELETED,
        deletedCount: response.deletedCount,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
