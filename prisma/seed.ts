import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs/promises';
import path from 'node:path';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Landlord Admin';

  if (adminEmail && adminPassword) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { name: adminName, role: 'ADMIN' },
      create: {
        email: adminEmail,
        name: adminName,
        role: 'ADMIN',
        passwordHash: await bcrypt.hash(adminPassword, 12)
      }
    });
  }

  const templatePath = path.join(process.cwd(), 'templates/lease/florida-long-term-lease.md');
  const bodyMarkdown = await fs.readFile(templatePath, 'utf8');
  await prisma.leaseTemplate.upsert({
    where: { id: 'florida-long-term-v1' },
    update: { bodyMarkdown, active: true },
    create: {
      id: 'florida-long-term-v1',
      name: 'Florida Long-Term Residential Lease',
      version: '1.0',
      jurisdiction: 'Florida',
      bodyMarkdown,
      active: true
    }
  });
}

main().finally(async () => prisma.$disconnect());
