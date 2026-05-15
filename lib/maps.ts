export type PropertyAddress = {
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  zip: string;
};

export function formatPropertyAddress(property: PropertyAddress) {
  return [property.address1, property.address2, property.city, property.state, property.zip]
    .filter(Boolean)
    .join(', ');
}

export function googleMapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function googleMapsEmbedUrl(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
