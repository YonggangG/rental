# Rental Manager

A bilingual English/Chinese rental-property management container for small Florida landlords managing roughly 20–50 rental homes. The project is inspired by the feature scope of MicroRealEstate, but intentionally built as a simpler Portainer-friendly application: one web app container plus PostgreSQL.

![Dashboard overview](docs/images/dashboard-overview.svg)

## Highlights

- **Landlord/Admin portal** for portfolio operations
- **Tenant portal** for lease downloads, rent history, maintenance requests, notices, and renter-insurance documents
- **Bilingual UI** with English/Chinese switching foundation
- **Portfolio map** using Leaflet + OpenStreetMap to show all rental properties with status-colored pins
- **Property detail map** using Google Maps embed/search URL without a Google API key
- **Florida long-term residential lease template** archived from the provided DOCX and prepared for PDF generation
- **Lease PDF generation pipeline** using `pdf-lib`
- **PostgreSQL + Prisma** data model
- **Docker/Portainer deployment**
- **GitHub Actions → GHCR image publishing**

## Current MVP Screens

### Landlord/Admin Dashboard

The Admin portal includes summary metrics, a portfolio map, and module cards for properties, tenants, leases, rent ledger, maintenance, and documents.

![Landlord dashboard](docs/images/dashboard-overview.svg)

### Tenant Portal

The Tenant portal is designed for self-service access to lease PDFs, rent balance/history, maintenance requests, notices, and renter insurance uploads.

![Tenant portal](docs/images/tenant-portal.svg)

### Property Detail Map

Each property detail page can display a map using an address-based Google Maps embed/search URL. This first version requires no Google Maps API key.

![Property map](docs/images/property-map.svg)

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL 16
- Leaflet + OpenStreetMap
- Google Maps URL embed for single-property views
- `pdf-lib` for PDF generation
- Docker multi-stage build
- Manual GHCR publishing now; optional GitHub Actions workflow template included

## Repository Structure

```text
app/                         Next.js app routes
  landlord/                  Landlord/Admin portal
  tenant/                    Tenant portal
  api/                       Health and lease PDF endpoints
components/                  UI, map, and property components
lib/                         i18n, map helpers, Prisma, lease helpers
prisma/                      Database schema, migrations, seed script
templates/                   Lease template archive and extracted text
docs/images/                 README diagrams/screenshots
docs/github-actions/           Optional GHCR publish workflow template
Dockerfile                   Production image build
docker-compose.yml           Local Docker Compose
docker-compose.portainer.yml Portainer stack template
PORTAINER.md                 Deployment guide
README.zh-CN.md              Chinese README
```

## Lease Template

The provided Florida lease DOCX is archived at:

```text
templates/original/empty-florida-lease.docx
```

Extracted source text and operational Markdown template:

```text
templates/lease/florida-long-term-lease-source-extract.txt
templates/lease/florida-long-term-lease.md
```

> Legal note: the template should be reviewed by a Florida landlord-tenant attorney before production use.

## Data Model Overview

Initial Prisma models include:

- `User`
- `Property`
- `Tenant`
- `LeaseTemplate`
- `Lease`
- `LeaseTenant`
- `RentCharge`
- `RentPayment`
- `MaintenanceRequest`
- `Document`

`Property` includes optional `latitude` and `longitude` fields for the Admin portfolio map.

## Local Development

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful routes:

```text
/landlord
/tenant
/landlord/properties/demo
/api/health
/api/leases/demo/pdf
```

## Docker Image

Published image:

```text
ghcr.io/yonggangg/rental:latest
```

Local build:

```bash
docker build -t rental:test .
```

## Portainer Deployment

Use the provided `docker-compose.portainer.yml` as a Portainer Stack.

### Required environment variables

```env
APP_URL=https://your-domain.example.com
NEXTAUTH_URL=https://your-domain.example.com
NEXTAUTH_SECRET=replace-with-long-random-secret
POSTGRES_DB=rental
POSTGRES_USER=rental
POSTGRES_PASSWORD=replace-with-strong-password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-temporary-admin-password
ADMIN_NAME=Landlord Admin
```

Generate a strong secret:

```bash
openssl rand -base64 32
```

### Portainer steps

1. Open **Portainer → Stacks → Add stack**.
2. Name the stack `rental`.
3. Paste the contents of `docker-compose.portainer.yml`.
4. Add the required environment variables.
5. Deploy the stack.
6. Open `APP_URL` or the mapped port, for example `http://server-ip:3000`.

If the GHCR package is public, Portainer does not need registry credentials. If you later make it private, add a `ghcr.io` registry credential in Portainer.

More details are in [PORTAINER.md](PORTAINER.md).

## GitHub Release and GHCR

The optional workflow template at `docs/github-actions/docker-ghcr.yml` can publish images to:

```text
ghcr.io/yonggangg/rental
```

On pushes to `main`, it publishes:

- `latest`
- `sha-<commit>`

On version tags such as `v0.1.0`, it also publishes the tag image.

## Current Status

This is an MVP scaffold, not a finished production system. It currently includes route structure, map components, data model, lease template archive, PDF pipeline, Docker deployment, and docs. Next implementation steps should add real CRUD screens, authentication flows, tenant document upload, rent ledger automation, and production lease rendering.

## License

MIT. See [LICENSE](LICENSE).
