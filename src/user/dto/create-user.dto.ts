import {
  IsEmail,
  IsString,
  Length,
  IsNotEmpty,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @Length(6, 18)
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  first_name: string

  @IsString()
  @IsNotEmpty()
  last_name: string
}
