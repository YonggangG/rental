import { LanguageSwitch } from '@/components/LanguageSwitch';
import { PortalCard } from '@/components/PortalCard';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale, t } from '@/lib/i18n';

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams; const locale = getLocale(sp); const m = t(locale); const user = await getCurrentUser();
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10"><header className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight">{m.appName}</h1><p className="mt-2 text-slate-600">{m.tagline}</p></div><div className="flex gap-3"><LanguageSwitch locale={locale} />{user?<a className="rounded-full border px-3 py-1 text-sm" href="/logout">{m.signOut}</a>:<a className="btn" href={`/login?lang=${locale}`}>{m.signIn}</a>}</div></header><section className="mt-12 grid gap-6 md:grid-cols-2"><PortalCard title={m.landlordPortal} description={m.landlordWelcome} href={user?`/landlord?lang=${locale}`:`/login?lang=${locale}`} /><PortalCard title={m.tenantPortal} description={m.tenantWelcome} href={user?`/tenant?lang=${locale}`:`/login?lang=${locale}`} /></section></main>;
}
