import { Module, CacheModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [UsersController,],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
