import { googleMapsEmbedUrl, googleMapsSearchUrl } from '@/lib/maps';

export function PropertyMap({ address }: { address: string }) {
  const embedUrl = googleMapsEmbedUrl(address);
  const openUrl = googleMapsSearchUrl(address);

  return (
    <section className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="font-semibold">Map / 地图</h2>
          <p className="mt-1 text-sm text-slate-500">{address}</p>
        </div>
        <a className="btn" href={openUrl} target="_blank" rel="noreferrer">
          Open Google Maps
        </a>
      </div>
      <iframe
        title={`Map for ${address}`}
        src={embedUrl}
        className="h-80 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
