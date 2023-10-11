import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/schemas/user.schema";
import { Workers } from "src/worker/schemas/worker.schema";


export class CreateRequestDto{

    @IsNotEmpty()
    @IsString()
    readonly field: string;

    @IsNotEmpty()
    @IsString()
    readonly status: string;

    @IsNotEmpty()
    @IsNumber()
    readonly cost: number;


    @IsNotEmpty()
    @IsString()
    readonly city: string;
    
    @IsNotEmpty()
    @IsString()
    readonly paymentMethod: string;

    @IsString()
    @IsOptional()
    readonly cancellationReason: string;

    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User;

    @IsNotEmpty()
    readonly worker: Workers;
}