import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateWorkerDto{

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsString()
    @IsNotEmpty()
    readonly field: string;

    @IsNumber()
    @IsNotEmpty()
    readonly avgRate: number;

}