import { LanguageSwitch } from '@/components/LanguageSwitch';
import { PropertyMap } from '@/components/property/PropertyMap';
import { formatPropertyAddress } from '@/lib/maps';
import { getLocale } from '@/lib/i18n';

const sampleProperty = {
  nickname: 'Sample Orlando Rental',
  address1: '400 W Church St',
  address2: null,
  city: 'Orlando',
  state: 'FL',
  zip: '32801',
  status: 'Occupied / 已出租',
  monthlyRent: '$2,000.00'
};

export default async function PropertyDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const locale = getLocale(sp);
  const address = formatPropertyAddress(sampleProperty);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <a className="text-sm text-slate-500" href={`/landlord?lang=${locale}`}>← Landlord Portal</a>
          <h1 className="mt-3 text-3xl font-bold">{sampleProperty.nickname}</h1>
          <p className="mt-2 text-slate-600">Property ID: {id}</p>
        </div>
        <LanguageSwitch locale={locale} />
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Status / 状态</p>
          <p className="mt-2 text-xl font-semibold">{sampleProperty.status}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Monthly Rent / 月租</p>
          <p className="mt-2 text-xl font-semibold">{sampleProperty.monthlyRent}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Address / 地址</p>
          <p className="mt-2 text-sm font-medium leading-6">{address}</p>
        </div>
      </section>

      <div className="mt-8">
        <PropertyMap address={address} />
      </div>
    </main>
  );
}
