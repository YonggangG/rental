import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'rental_session';

function secret() {
  return process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export async function createSession(userId: string) {
  const payload = JSON.stringify({ userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  const encoded = Buffer.from(payload).toString('base64url');
  const token = `${encoded}.${sign(encoded)}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig || sign(encoded) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as { userId: string; exp: number };
    if (!payload.userId || payload.exp < Date.now()) return null;
    return prisma.user.findUnique({ where: { id: payload.userId }, include: { tenant: true } });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!['ADMIN', 'LANDLORD', 'MANAGER'].includes(user.role)) redirect('/tenant');
  return user;
}
