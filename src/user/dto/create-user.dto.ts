import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsString,
  Length,
  IsNotEmpty,
} from 'class-validator'

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  first_name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  last_name: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string

  @IsString()
  @Length(6, 18)
  @IsNotEmpty()
  @ApiProperty()
  password: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string


}
