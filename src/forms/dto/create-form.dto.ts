import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsArray,
} from 'class-validator'
import { QuestionResponse } from '../entities/question-response.entity';

export class CreateFormDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    stage: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    formIdentifier: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    responses: QuestionResponse[];
}
