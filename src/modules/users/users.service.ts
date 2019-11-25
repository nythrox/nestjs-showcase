import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { UserModel } from './user.model';
import { throwError } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersModule } from './users.module';

@Injectable()
export class UsersService {

    getUsers(query) {
        return [
            new UserModel({
                username: "Jason",
                id: 0,
                password: "jasdjdas",
                email: "jason@gmal.com",
                roles: ["ADMIN"]
            }),
            new UserModel({
                username: "Jason",
                id: 1,
                password: "jasdjdas",
                email: "jsn@gmail.com",
                roles: ["ADMIN"]
            }),
            new UserModel({
                username: "Jason",
                id: 2,
                password: "jasdjdas",
                email: "jaso@gmil.com",
                roles: ["ADMIN"]
            }),
            new UserModel({
                username: "Jason",
                id: 3,
                password: "jasdjdas",
                email: "jaon@mail.com",
                roles: ["ADMIN"]
            })
        ];
    }

    getUserById(id: number) {
        return new UserModel({
            username: "UserGotById",
            id: id,
            password: "jasdjdas",
            email: "jason@gmail.com",
            roles: ["ADMIN"]
        })
    }

    getUserByEmail(email: String) {
        return new UserModel({
            username: "UserGotById",
            id: 0,
            password: "jasdjdas",
            email: email,
            roles: ["ADMIN"]
        })
    }

    createUser(user: CreateUserDto): UserModel {
        return new UserModel({
            username: user.username,
            id: 1,
            password: user.password,
            email: user.email,
            roles: ["USER"]
        })
    }

}
