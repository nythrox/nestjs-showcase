import { CanActivate, ExecutionContext, Injectable, Inject, Optional } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(@Optional() @Inject('REFLECTOR') private readonly reflector: Reflector) {
    this.reflector = new Reflector();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const godRole = "ADMIN";
    const routeRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!routeRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    const isAdmin = () => user.roles.includes(godRole);
    const hasRole = () => user.roles.some((role) => routeRoles.includes(role));
    return user && user.roles && hasRole() || user && user.roles && isAdmin();
  }
}

