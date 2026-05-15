import { LanguageSwitch } from '@/components/LanguageSwitch';
import { PortalCard } from '@/components/PortalCard';
import { getLocale, t } from '@/lib/i18n';

export default function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const locale = getLocale(searchParams);
  const m = t(locale);
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{m.appName}</h1>
          <p className="mt-2 text-slate-600">{m.tagline}</p>
        </div>
        <LanguageSwitch locale={locale} />
      </header>
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <PortalCard title={m.landlordPortal} description={m.landlordWelcome} href={`/landlord?lang=${locale}`} />
        <PortalCard title={m.tenantPortal} description={m.tenantWelcome} href={`/tenant?lang=${locale}`} />
      </section>
    </main>
  );
}
