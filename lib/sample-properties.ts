export type MapProperty = {
  id: string;
  nickname: string;
  address: string;
  status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
  monthlyRent: string;
  tenant?: string;
  leaseEnds?: string;
  latitude: number;
  longitude: number;
};

export const sampleMapProperties: MapProperty[] = [
  {
    id: 'demo',
    nickname: 'Downtown Orlando Rental',
    address: '400 W Church St, Orlando, FL 32801',
    status: 'OCCUPIED',
    monthlyRent: '$2,000',
    tenant: 'Sample Tenant',
    leaseEnds: '2026-07-31',
    latitude: 28.5402,
    longitude: -81.3839
  },
  {
    id: 'winter-park-demo',
    nickname: 'Winter Park Rental',
    address: '251 Park Ave S, Winter Park, FL 32789',
    status: 'VACANT',
    monthlyRent: '$2,350',
    latitude: 28.5962,
    longitude: -81.3510
  },
  {
    id: 'kissimmee-demo',
    nickname: 'Kissimmee Rental',
    address: '101 Church St, Kissimmee, FL 34741',
    status: 'MAINTENANCE',
    monthlyRent: '$1,850',
    latitude: 28.2920,
    longitude: -81.4076
  }
];
