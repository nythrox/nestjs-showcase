import { Module, ValidationPipe, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MetadataFilter } from '../../shared/filters/metadata.filter';
import { ResponseMapperInterceptor } from '../../shared/interceptors/response-mapper.interceptor';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';

const filters = [{
  provide: APP_INTERCEPTOR,
  useClass: ResponseMapperInterceptor,
}]

const interceptors = [{
  provide: APP_FILTER,
  useClass: MetadataFilter
}]

const pipes = [
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
      transform: true
    })
  }
]
const guards = []

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ...interceptors, ...filters, ...pipes, ...guards],
})
export class AppModule { }
