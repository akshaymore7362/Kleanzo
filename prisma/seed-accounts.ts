import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
  console.log('Seeding core module demo accounts into Kleanzo database...');

  // 1. Admin Operations User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kleanzo.com' },
    update: {
      password: hashPassword('admin123'),
      role: 'ADMIN',
      active: true,
    },
    create: {
      email: 'admin@kleanzo.com',
      name: 'Kleanzo Admin Operations',
      phone: '9999988888',
      password: hashPassword('admin123'),
      role: 'ADMIN',
      active: true,
    },
  });
  console.log('✅ Admin Account Ready:', adminUser.email);

  // 2. Agency User
  const agencyUser = await prisma.user.upsert({
    where: { email: 'pune.agency@kleanzo.com' },
    update: {
      password: hashPassword('agency123'),
      role: 'AGENCY_ADMIN',
      active: true,
    },
    create: {
      email: 'pune.agency@kleanzo.com',
      name: 'Pune DeepClean Tech Manager',
      phone: '9876500001',
      password: hashPassword('agency123'),
      role: 'AGENCY_ADMIN',
      active: true,
    },
  });

  let agency = await prisma.agency.findFirst({
    where: { name: 'Pune DeepClean Tech' },
  });

  if (!agency) {
    agency = await prisma.agency.create({
      data: {
        name: 'Pune DeepClean Tech',
        tagline: 'Certified Kleanzo Partner Agency',
        description: 'Premier post-construction and handover deep cleaning partner in Pune.',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Baner Road, Pune 411045',
        pinCode: '411045',
        phone: '9876500001',
        email: 'pune.agency@kleanzo.com',
        verified: true,
        active: true,
        userId: agencyUser.id,
      },
    });
  } else {
    await prisma.agency.update({
      where: { id: agency.id },
      data: { userId: agencyUser.id },
    });
  }

  console.log('✅ Agency Partner Account Ready:', agencyUser.email);

  // 3. Customer User & Customer Profile
  const customerUser = await prisma.user.upsert({
    where: { email: 'rahul.sharma@example.com' },
    update: {
      password: hashPassword('customer123'),
      role: 'CUSTOMER',
      active: true,
    },
    create: {
      email: 'rahul.sharma@example.com',
      name: 'Rahul Sharma',
      phone: '9876543210',
      password: hashPassword('customer123'),
      role: 'CUSTOMER',
      active: true,
      customerProfile: {
        create: {
          city: 'Pune',
          address: 'Kalyani Nagar, Pune',
        },
      },
    },
  });
  console.log('✅ Customer Account Ready:', customerUser.email);

  console.log('\n--- ALL DEMO ACCOUNTS SEEDED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
