'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth/session';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const lang = String(formData.get('lang') || 'en');
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect(`/login?lang=${lang}&error=1`);
  }
  await createSession(user.id);
  redirect(user.role === 'TENANT' ? `/tenant?lang=${lang}` : `/landlord?lang=${lang}`);
}
