import { LanguageSwitch } from '@/components/LanguageSwitch';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';

export function AdminShell({ locale, title, children }: { locale: Locale; title: string; children: React.ReactNode }) {
  const m = t(locale);
  const nav = [
    ['/landlord', m.dashboard], ['/landlord/properties', m.properties], ['/landlord/tenants', m.tenants], ['/landlord/leases', m.leases], ['/landlord/rent', m.rentLedger], ['/landlord/maintenance', m.maintenance], ['/landlord/documents', m.documents], ['/landlord/lease-templates', m.leaseTemplates]
  ];
  return <main className="mx-auto max-w-7xl px-6 py-8"><header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><a className="text-sm text-slate-500" href={`/?lang=${locale}`}>← {m.home}</a><h1 className="mt-2 text-3xl font-bold">{title}</h1></div><div className="flex items-center gap-3"><LanguageSwitch locale={locale} /><a className="rounded-full border px-3 py-1 text-sm" href="/logout">{m.signOut}</a></div></header><nav className="mt-6 flex flex-wrap gap-2">{nav.map(([href,label]) => <a className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-100" href={`${href}?lang=${locale}`} key={href}>{label}</a>)}</nav><div className="mt-6">{children}</div></main>;
}
