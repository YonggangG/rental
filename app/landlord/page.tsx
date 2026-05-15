import { AdminShell } from '@/components/admin/AdminShell';
import { PortfolioMap } from '@/components/map/PortfolioMap';
import { getLocale, statusLabel, t } from '@/lib/i18n';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { formatPropertyAddress } from '@/lib/maps';

export default async function LandlordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams; const locale = getLocale(sp); const m = t(locale);
  const [properties, tenants, charges, maintenance] = await Promise.all([
    prisma.property.findMany(), prisma.tenant.count(), prisma.rentCharge.findMany(), prisma.maintenanceRequest.count({ where: { status: { in: ['OPEN','IN_PROGRESS','WAITING_TENANT'] } } })
  ]);
  const rentDue = charges.reduce((sum,c)=>sum+Number(c.amount)+Number(c.lateFee),0);
  const mapProps = properties.filter(p=>p.latitude && p.longitude).map(p=>({ id:p.id, nickname:p.nickname || formatPropertyAddress(p), address:formatPropertyAddress(p), status:p.status as any, monthlyRent:p.monthlyRent ? `$${Number(p.monthlyRent).toFixed(2)}` : '-', latitude:Number(p.latitude), longitude:Number(p.longitude) }));
  const metrics = [[m.properties, properties.length], [m.tenants, tenants], [m.rentLedger, `$${rentDue.toFixed(2)}`], [m.maintenance, maintenance]];
  return <AdminShell locale={locale} title={m.landlordPortal}><section className="grid gap-4 md:grid-cols-4">{metrics.map(([label,value])=><div className="card" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</section><section className="card mt-8 overflow-hidden p-0"><div className="flex flex-col gap-3 border-b px-6 py-4 md:flex-row md:items-center md:justify-between"><div><h2 className="text-xl font-semibold">{m.portfolioMap}</h2><p className="mt-1 text-sm text-slate-500">{m.portfolioMapHelp}</p></div><div className="flex gap-3 text-xs"><span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-blue-600" />{m.occupied}</span><span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-600" />{m.vacant}</span><span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-600" />{m.maintenanceStatus}</span></div></div><PortfolioMap properties={mapProps} /></section><section className="mt-8 grid gap-4 md:grid-cols-3">{[['/landlord/properties',m.properties],['/landlord/tenants',m.tenants],['/landlord/leases',m.leases],['/landlord/rent',m.rentLedger],['/landlord/maintenance',m.maintenance],['/landlord/documents',m.documents]].map(([href,label])=><a className="card block hover:shadow-md" href={`${href}?lang=${locale}`} key={href}><h2 className="font-semibold">{label}</h2><p className="mt-2 text-sm text-slate-500">{locale==='zh'?'打开管理页面':'Open management page'}</p></a>)}</section></AdminShell>;
}
