import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsString,
  Length,
  IsNotEmpty,
  IsBoolean,
  IsOptional
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  is_email_verified: boolean

  @IsString()
  @Length(6, 18)
  @IsNotEmpty()
  @ApiProperty()
  password: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string

  @IsString()
  @IsNotEmpty()
  first_name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  last_name: string

}
