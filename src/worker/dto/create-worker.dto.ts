import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateWorkerDto{

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly field: string;

    @IsNumber()
    @IsNotEmpty()
    readonly averageRating: number;

    @IsNumber()
    @IsNotEmpty()
    readonly distanceFromRequestLocation: number;

}