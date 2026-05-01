const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

// Must load .env manually since we are running a raw node script
require('dotenv').config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Original admin
  const adminEmail = 'admin@gmail.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    await prisma.user.create({
      data: {
        name: 'Superuser Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Superuser admin@gmail.com created successfully.');
  } else {
    console.log('Superuser already exists.');
  }

  // New admin requested by user
  const newAdminEmail = 's@g.com';
  const existingNewAdmin = await prisma.user.findUnique({
    where: { email: newAdminEmail },
  });

  if (!existingNewAdmin) {
    const hashedPassword = await bcrypt.hash('gupta2537', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: newAdminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin s@g.com created successfully.');
  } else {
    // Update password if already exists
    const hashedPassword = await bcrypt.hash('gupta2537', 10);
    await prisma.user.update({
      where: { email: newAdminEmail },
      data: { password: hashedPassword, role: 'ADMIN' },
    });
    console.log('Admin s@g.com already existed — password updated.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
