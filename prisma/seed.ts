import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Permissions
  const permissions = [
    'data permission',
    'detail permission',
    'create permission',
    'update permission',
    'delete permission',
    'data role',
    'detail role',
    'create role',
    'update role',
    'delete role',
    'data user',
    'detail user',
    'create user',
    'update user',
    'delete user',
    'data awlr station',
    'detail awlr station',
    'create awlr station',
    'update awlr station',
    'delete awlr station',
    'data awlr log',
    'create awlr log',
    'update awlr log',
    'delete awlr log',
    'data arr station',
    'detail arr station',
    'create arr station',
    'update arr station',
    'delete arr station',
    'data arr log',
    'create arr log',
    'update arr log',
    'delete arr log',
    'data aws station',
    'detail aws station',
    'create aws station',
    'update aws station',
    'delete aws station',
    'data aws log',
    'create aws log',
    'update aws log',
    'delete aws log',
    'data cctv',
    'detail cctv',
    'create cctv',
    'update cctv',
    'delete cctv',
    'data sirine',
    'detail sirine',
    'create sirine',
    'update sirine',
    'delete sirine',
    'data vehicle',
    'detail vehicle',
    'create vehicle',
    'update vehicle',
    'delete vehicle',
    'data report',
    'detail report',
    'create report',
    'update report',
    'delete report',
    'data contact wa',
    'detail contact wa',
    'create contact wa',
    'update contact wa',
    'delete contact wa',
  ];

  const existingPermissions = await prisma.permission.findMany({
    where: { name: { in: permissions } },
    select: { name: true },
  });

  const newPermissions = permissions
    .filter((name) => !existingPermissions.some((p) => p.name === name))
    .map((name) => ({ name }));

  if (newPermissions.length) {
    await prisma.permission.createMany({ data: newPermissions });
    console.log(`${newPermissions.length} permissions created`);
  }

  // 2. Roles
  const roles = ['Super Admin', 'Admin', 'Operator', 'Control Room'];

  const existingRoles = await prisma.role.findMany({
    where: { name: { in: roles } },
    select: { name: true },
  });

  const newRoles = roles
    .filter((name) => !existingRoles.some((r) => r.name === name))
    .map((name) => ({ name }));

  if (newRoles.length) {
    await prisma.role.createMany({ data: newRoles });
    console.log(`${newRoles.length} roles created`);
  }

  // Ambil role Super Admin & Admin
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'Super Admin' },
  });
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });

  // 3. Assign all permissions to Super Admin
  const allPermissions = await prisma.permission.findMany({
    select: { id: true },
  });

  if (superAdminRole) {
    const existingRolePerms = await prisma.roleHasPermission.findMany({
      where: { roleId: superAdminRole.id },
      select: { permissionId: true },
    });

    const existingPermIds = existingRolePerms.map((rp) => rp.permissionId);

    const newRolePerms = allPermissions
      .filter((perm) => !existingPermIds.includes(perm.id))
      .map((perm) => ({
        roleId: superAdminRole.id,
        permissionId: perm.id,
      }));

    if (newRolePerms.length) {
      await prisma.roleHasPermission.createMany({ data: newRolePerms });
      console.log(`${newRolePerms.length} permissions assigned to Super Admin`);
    }
  }

  // 4. Buat Super Admin user
  const superAdminUser = await prisma.user.findUnique({
    where: { email: 'super.admin@email.com' },
  });

  if (!superAdminUser && superAdminRole) {
    const hashedPassword = await bcrypt.hash('password', 10);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'super.admin@email.com',
        username: 'super_admin',
        password: hashedPassword,
        isActive: true,
        roles: {
          create: {
            role: { connect: { id: superAdminRole.id } },
          },
        },
      },
    });
    console.log('Super Admin user created');
  }

  // 5. Buat Admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@email.com' },
  });

  if (!adminUser && adminRole) {
    const hashedPassword = await bcrypt.hash('password', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@email.com',
        username: 'admin',
        password: hashedPassword,
        isActive: true,
        roles: {
          create: {
            role: { connect: { id: adminRole.id } },
          },
        },
      },
    });
    console.log('Admin user created');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
