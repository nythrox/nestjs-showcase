import { Controller, Get, Body, Param, Query, ParseIntPipe, ParseUUIDPipe, Post, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthRoles } from 'src/shared/decorators/auth-roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UseCache } from 'src/shared/decorators/use-cache.decorator';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}


    @UseInterceptors(CacheInterceptor)
    @AuthRoles('USER')
    @Get()
    users(@Query() query){
        return this.usersService.getUsers(query);
    }

    @AuthRoles('USER')
    @Get(':id')
    byUserId(@Param('id', ParseIntPipe) id : number){
        return this.usersService.getUserById(id);
    }

    @Post()
    createUser(@Body() user : CreateUserDto){
        return this.usersService.createUser(user)
    }

}
