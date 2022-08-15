import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AuthenticationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string
}

export class ReturnAuthenticatedCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id_token: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string
}

export class ValidateEmailTokenDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  token: string

}
