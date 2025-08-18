import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAreaDto{
    @IsString() @IsNotEmpty() name!: string;
    @IsString() @IsOptional() description?: string;
}