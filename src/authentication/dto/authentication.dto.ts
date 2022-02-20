import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthenticationDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsString()
    id_token: string
}
