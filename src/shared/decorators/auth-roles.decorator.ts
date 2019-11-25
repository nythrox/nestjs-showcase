import { ReflectMetadata, applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';

// export const AuthRoles = (...args: string[]) => ReflectMetadata('auth-roles', args);

export function AuthRoles(...roles) {
    return applyDecorators(
      SetMetadata('roles', roles),
      UseGuards(AuthGuard('jwt'), RolesGuard)
    );
  }
  