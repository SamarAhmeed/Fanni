import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @ApiOperation({ summary: 'Add new user' })
    @Post('/signup')
    signUp(@Body() signupDto: SignUpDto): Promise<{token: string}>{
        return this.authService.signUp(signupDto);
    } 

    @ApiOperation({ summary: 'Login' })
    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{token: string}>{
        return this.authService.login(loginDto);
    } 
}
