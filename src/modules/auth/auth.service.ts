import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../users/user.model';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService : JwtService) {}

    async validateUser(email: string, pass: string): Promise<any> {
      const user = await this.usersService.getUserByEmail(email);
      if (user && user.password === pass) {
        return user;
      }
      return null;
    }

    async login(user) {
      const payload = {sub: user.id, username: user.username, roles: user.roles};
      return {
        payload: payload,
        access_token: this.jwtService.sign(payload),
      };
    }


  
}
