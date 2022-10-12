import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ExportFormatTypes } from "../interfaces";

export class ExportFormDto {
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsEnum(ExportFormatTypes)
  format: ExportFormatTypes;
}
