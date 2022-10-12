import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum ExportFormatTypes {
  CSV = "csv",
}

export class ExportFormDto {
  @IsString()
  @IsNotEmpty()
  readonly startDate: string;
  @IsString()
  @IsNotEmpty()
  readonly endDate: string;

  @IsNotEmpty()
  @IsEnum(ExportFormatTypes)
  readonly format: ExportFormatTypes;
}
