import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserAndSupportRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user.email);
    console.log(user.role);
    const allowedRoles = ['admin', 'user'];
    const hasRole = () => allowedRoles.includes(user.role);
    console.log(hasRole());
    return hasRole();
  }
}
@Injectable()
export class UserRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const allowedRoles = ['user'];

    const hasRole = () => allowedRoles.includes(user.role);
    return hasRole();
  }
}
@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const allowedRoles = ['admin'];

    const hasRole = () => allowedRoles.includes(user.role);
    return hasRole();
  }
}
