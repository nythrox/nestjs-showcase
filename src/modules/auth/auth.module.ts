import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

const jwtConfigsFactory = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
        return {
            secret: configService.jwtSecret,
            signOptions: { expiresIn: '6000000000s' }
        }
    },
    inject: [ConfigService]
}

@Module({
    imports: [
        UsersModule,
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        // JwtModule.register({
        //     secret:'',
        //     signOptions: { expiresIn: '6000000000s' },
        // }),
        JwtModule.registerAsync(jwtConfigsFactory)
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {

}
