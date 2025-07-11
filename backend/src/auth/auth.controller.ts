import { Controller,  Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const token = await this.authService.login(body.email, body.password);
        if (!token) throw new UnauthorizedException('Invalid credentials');
        return { access_token: token };
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.authService.register(createUserDto);
        return { message: 'User registered successfully', userId: user.id };
    }
    
}
