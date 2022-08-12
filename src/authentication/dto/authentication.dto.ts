import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AuthenticationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string
}

export class ReturnAuthenticatedCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id_token: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refresh_token: string
}

export class ValidateEmailTokenDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  token: string

}
