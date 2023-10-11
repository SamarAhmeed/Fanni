import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/schemas/user.schema";


export class UpdateRequestDto{

    @IsOptional()
    @IsString()
    readonly field: string;

    @IsOptional()
    @IsString()
    readonly status: string;

    @IsOptional()
    @IsNumber()
    readonly cost: number;


    @IsOptional()
    @IsString()
    readonly city: string;
    
    @IsOptional()
    @IsString()
    readonly paymentMethod: string;

    @IsOptional()
    @IsString()
    readonly cancellationReason: string;

    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User;
}