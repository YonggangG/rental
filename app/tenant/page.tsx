import { LanguageSwitch } from '@/components/LanguageSwitch';
import { getLocale, t } from '@/lib/i18n';

export default function TenantPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const locale = getLocale(searchParams);
  const m = t(locale);
  const items = [m.leases, m.rentLedger, m.maintenance, 'Notices / 通知', 'Insurance / 租客保险'];
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <a className="text-sm text-slate-500" href={`/?lang=${locale}`}>← Home</a>
          <h1 className="mt-3 text-3xl font-bold">{m.tenantPortal}</h1>
          <p className="mt-2 text-slate-600">{m.tenantWelcome}</p>
        </div>
        <LanguageSwitch locale={locale} />
      </header>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => <div className="card" key={item}><h2 className="font-semibold">{item}</h2><p className="mt-2 text-sm text-slate-500">Tenant self-service placeholder.</p></div>)}
      </section>
    </main>
  );
}
