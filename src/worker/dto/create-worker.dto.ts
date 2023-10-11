import { IsEmpty, IsNumber, IsString } from "class-validator";


export class CreateWorkerDto{

    @IsString()
    @IsEmpty()
    readonly name: string;
    
    @IsString()
    @IsEmpty()
    readonly phone: string;

    @IsString()
    @IsEmpty()
    readonly field: string;

    @IsNumber()
    @IsEmpty()
    readonly avgRate: number;

}