import { IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateWorkerDto{

    @IsString()
    @IsOptional()
    readonly name: string;
    
    @IsString()
    @IsOptional()
    readonly phone: string;

    @IsString()
    @IsOptional()
    readonly field: string;

    @IsNumber()
    @IsOptional()
    readonly avgRate: number;

}