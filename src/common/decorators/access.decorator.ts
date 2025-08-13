import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'requiredRoles';
export const PERMISSIONS_KEY = 'requiredPermissions';

export const Role = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const Permission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
