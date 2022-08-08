import {
    IsString,
    IsNotEmpty,
    IsArray,
} from 'class-validator'
import { QuestionResponse } from '../entities/question-response.entity';

export class CreateFormDto {

    @IsString()
    @IsNotEmpty()
    userId: string;
    
    @IsString()
    @IsNotEmpty()
    stage: string;

    @IsString()
    @IsNotEmpty()
    formIdentifier: string;

    @IsArray()
    @IsNotEmpty()
    responses: QuestionResponse[];
}
