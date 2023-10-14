import { IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateWorkerDto{

    @IsString()
    @IsOptional()
    readonly name: string;
    
    @IsString()
    @IsOptional()
    readonly username: string;

    @IsString()
    @IsOptional()
    readonly field: string;

    @IsNumber()
    @IsOptional()
    readonly averageRating: number;

    @IsNumber()
    @IsOptional()
    readonly distanceFromRequestLocation: number;
}