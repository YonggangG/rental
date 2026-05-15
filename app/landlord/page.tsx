import { LanguageSwitch } from '@/components/LanguageSwitch';
import { PortfolioMap } from '@/components/map/PortfolioMap';
import { sampleMapProperties } from '@/lib/sample-properties';
import { getLocale, t } from '@/lib/i18n';

const metrics = [
  ['Properties / 房屋', '0'],
  ['Occupied / 已出租', '0'],
  ['Rent Due / 应收租金', '$0'],
  ['Late / 逾期', '$0']
];

export default function LandlordPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const locale = getLocale(searchParams);
  const m = t(locale);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <a className="text-sm text-slate-500" href={`/?lang=${locale}`}>← Home</a>
          <h1 className="mt-3 text-3xl font-bold">{m.landlordPortal}</h1>
          <p className="mt-2 text-slate-600">{m.landlordWelcome}</p>
        </div>
        <LanguageSwitch locale={locale} />
      </header>
      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value]) => <div className="card" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}
      </section>
      <section className="card mt-8 overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Portfolio Map / 房源总览地图</h2>
            <p className="mt-1 text-sm text-slate-500">All rental properties on one OpenStreetMap view. No Google API key required.</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-blue-600" />Occupied</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-600" />Vacant</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-600" />Maintenance</span>
          </div>
        </div>
        <PortfolioMap properties={sampleMapProperties} />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[m.properties, m.tenants, m.leases, m.rentLedger, m.maintenance, m.documents].map((item) => <div className="card" key={item}><h2 className="font-semibold">{item}</h2><p className="mt-2 text-sm text-slate-500">MVP module placeholder.</p>{item === m.properties ? <a className="mt-4 inline-block text-sm font-semibold" href={`/landlord/properties/demo?lang=${locale}`}>View sample property map →</a> : null}</div>)}
      </section>
    </main>
  );
}
