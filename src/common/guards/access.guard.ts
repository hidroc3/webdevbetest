import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  ROLES_KEY,
  PERMISSIONS_KEY,
} from '@/common/decorators/access.decorator';
import { JwtInterface } from '../interface/jwt.interface';

interface RequestWithUser extends Request {
  user: JwtInterface;
}

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    if (requiredRoles?.length) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          `You do not have role to access this resource.`,
        );
      }
    }

    if (requiredPermissions?.length) {
      const hasPermission = requiredPermissions.every((perm) =>
        user.permissions.includes(perm),
      );
      if (!hasPermission) {
        throw new ForbiddenException(
          `You do not have permission to access this resource.`,
        );
      }
    }

    return true;
  }
}
