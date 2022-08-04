import {
    IsString,
    IsNotEmpty,
} from 'class-validator'

export class CreateFormDto {

    @IsString()
    @IsNotEmpty()
    userId: string;
    
    @IsString()
    @IsNotEmpty()
    stage: string;

    @IsString()
    @IsNotEmpty()
    formIdentifier: string;
}
