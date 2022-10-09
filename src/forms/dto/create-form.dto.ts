import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { QuestionResponse } from "../entities/question-response.entity";

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  stage: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  formIdentifier: string;

  @IsNotEmpty()
  @ApiProperty()
  responses: QuestionResponse;
}
