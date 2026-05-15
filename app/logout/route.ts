import { destroySession } from '@/lib/auth/session';

export async function GET() {
  await destroySession();
  return Response.redirect(new URL('/login', process.env.APP_URL || 'http://localhost:3000'));
}
