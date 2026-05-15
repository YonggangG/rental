'use client';

import { useEffect, useRef } from 'react';
import type { MapProperty } from '@/lib/sample-properties';

const statusColor: Record<MapProperty['status'], string> = {
  OCCUPIED: '#2563eb',
  VACANT: '#16a34a',
  MAINTENANCE: '#ea580c'
};

export function PortfolioMap({ properties }: { properties: MapProperty[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = await import('leaflet');
      if (cancelled || !mapRef.current || instanceRef.current) return;

      const map = L.map(mapRef.current, { scrollWheelZoom: false });
      instanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      properties.forEach((property) => {
        const latLng = L.latLng(property.latitude, property.longitude);
        bounds.extend(latLng);
        const icon = L.divIcon({
          className: 'portfolio-marker',
          html: `<span style="background:${statusColor[property.status]}"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        L.marker(latLng, { icon })
          .bindPopup(`
            <strong>${property.nickname}</strong><br />
            ${property.address}<br />
            Status: ${property.status}<br />
            Rent: ${property.monthlyRent}<br />
            ${property.tenant ? `Tenant: ${property.tenant}<br />` : ''}
            ${property.leaseEnds ? `Lease ends: ${property.leaseEnds}<br />` : ''}
            <a href="/landlord/properties/${property.id}">View details</a>
          `)
          .addTo(map);
      });

      if (properties.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
      } else {
        map.setView([28.5383, -81.3792], 10);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, [properties]);

  return <div ref={mapRef} className="h-[420px] w-full rounded-b-2xl" />;
}
