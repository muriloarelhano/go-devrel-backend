import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

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
