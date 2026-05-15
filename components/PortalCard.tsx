import Link from 'next/link';

export function PortalCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="card block transition hover:-translate-y-0.5 hover:shadow-md">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}
