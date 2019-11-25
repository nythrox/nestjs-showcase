import { Controller, Post, Body, UseGuards, Req, Get, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthRoles } from 'src/shared/decorators/auth-roles.decorator';

@Controller('auth')
export class AuthController {  
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('login'))
    @Post('login')
    login(@User() user){
        return this.authService.login(user);
    }
    
  

}
