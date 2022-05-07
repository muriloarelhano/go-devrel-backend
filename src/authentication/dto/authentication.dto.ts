import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AuthenticationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}

export class AuthenticatedDto {
  @IsNotEmpty()
  @IsString()
  id_token: string

  @IsNotEmpty()
  @IsString()
  refresh_token: string
}

export class ValidationDto {
  @IsString()
  @IsOptional()
  token: string
  
  @IsString()
  @IsOptional()
  phone: string
}
