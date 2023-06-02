import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService ) {}

    @Post("register")
    register(@Body() dto: AuthDto ) {
        return this.authService.register(dto)
    }

    @Post("login")
    login(@Body() dto: LoginDto ) {
        return this.authService.login(dto)
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("me")
    userInfo(@Request() req) {
        const userId = req.user.userId
        return this.authService.userInfo(userId)
    }
}
