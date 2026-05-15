# Rental Manager

A bilingual English/Chinese rental-property management container for small Florida landlords managing roughly 20–50 rental homes. The project is inspired by the feature scope of MicroRealEstate, but intentionally built as a simpler Portainer-friendly application: one web app container plus PostgreSQL.

![Login screen](docs/images/login-screen.svg)

## Highlights

- **Landlord/Admin portal** for portfolio operations
- **Tenant portal** for lease downloads, rent history, maintenance requests, notices, and renter-insurance documents
- **Bilingual UI** with English/Chinese switching foundation
- **Portfolio map** using Leaflet + OpenStreetMap to show all rental properties with status-colored pins
- **Property detail map** using Google Maps embed/search URL without a Google API key
- **Florida long-term residential lease template** archived from the provided DOCX and prepared for PDF generation
- **Lease PDF generation pipeline** using `pdf-lib`
- **Core edit pages** for properties, tenants, leases, rent charges, maintenance, documents, and lease templates
- **Persistent document uploads** under `/data/uploads`, with safe path handling, categorization, download links, and property/tenant/lease binding
- **Rent automation** for monthly charge generation, duplicate prevention, overdue status, late fees, payment entry, and tenant balance summaries
- **Rental operations fields** including property market value, monthly due day on properties/leases/tenants, maintenance cost, tenant SMS reminder opt-in, and multi-tenant lease creation
- **Cleaner lease PDFs** with template fallback, wrapped text, pagination, and structured landlord/tenant/witness signature blocks
- **PostgreSQL + Prisma** data model
- **Docker/Portainer deployment**
- **GitHub Actions → GHCR image publishing**

## Current MVP Screens

### Login

Admin and tenant portals are password-protected. The UI can switch between English and Chinese with `?lang=en` / `?lang=zh` without mixing languages on the same page.

![Login screen](docs/images/login-screen.svg)

### Landlord/Admin Dashboard

The Admin portal includes summary metrics, a Leaflet/OpenStreetMap portfolio map, and module navigation for properties, tenants, leases, rent ledger, maintenance, documents, and lease templates.

![Landlord dashboard](docs/images/landlord-dashboard.svg)

### Admin CRUD and Rent Generation

Admin pages provide create/update foundations for core records. The rent ledger can generate monthly rent charges from active leases, avoid duplicate monthly charges, mark overdue balances, apply late fees, and record payments.

![Admin CRUD and rent generation](docs/images/admin-crud-rent.svg)

### Tenant Self-Service

The Tenant portal supports lease PDF access, rent history, maintenance request submission, and document uploads such as renter-insurance files.

![Tenant self-service](docs/images/tenant-self-service.svg)

### Lease Template and PDF Rendering

The Florida lease template is regenerated from the provided DOCX paragraph order and includes the extracted articles plus tenant/landlord witness signature fields.

![Lease template and PDF rendering](docs/images/lease-template-pdf.svg)

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
- GitHub Actions for GHCR publishing

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
docs/images/                 README screenshots/diagrams
.github/workflows/           GHCR publish workflow
docs/github-actions/           Backup workflow template
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

`Property` includes optional `latitude`, `longitude`, and `marketValue` fields for the Admin portfolio map and property valuation tracking.

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

Current local `latest` image size:

```text
Decimal size: about 552 MB
```

The project publishes GHCR as `latest` only. Portainer will also download the PostgreSQL image if it is not already present on the server.

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

### Environment variable reference

| Variable | Purpose |
| --- | --- |
| `APP_URL` | Public URL of the app, for example `https://rental.yourdomain.com` or `http://server-ip:3000` during testing. |
| `NEXTAUTH_URL` | URL used by NextAuth for login/session callbacks. Usually the same as `APP_URL`. It must be accurate once authentication is enabled. |
| `NEXTAUTH_SECRET` | Long random secret used to sign/encrypt auth sessions and tokens. Generate it with `openssl rand -base64 32`. |
| `POSTGRES_DB` | PostgreSQL database name. Default example: `rental`. |
| `POSTGRES_USER` | PostgreSQL username. Default example: `rental`. |
| `POSTGRES_PASSWORD` | PostgreSQL password. Use a strong password, especially on an internet-accessible server. |
| `ADMIN_EMAIL` | Initial admin account email seeded on first deployment. |
| `ADMIN_PASSWORD` | Initial admin password. Use a temporary strong password and change it once account management is implemented. |
| `ADMIN_NAME` | Display name for the initial admin user, for example `Landlord Admin`. |

### YAML quoting recommendation

In Docker Compose / Portainer YAML, quoting environment values is recommended, especially for URLs, secrets, passwords, and values containing spaces or special characters such as `:`, `#`, `$`, `@`, or `!`.

Recommended YAML style:

```yaml
environment:
  APP_URL: "https://your-domain.example.com"
  NEXTAUTH_URL: "https://your-domain.example.com"
  NEXTAUTH_SECRET: "replace-with-long-random-secret"
  POSTGRES_DB: "rental"
  POSTGRES_USER: "rental"
  POSTGRES_PASSWORD: "replace-with-strong-password"
  ADMIN_EMAIL: "admin@example.com"
  ADMIN_PASSWORD: "replace-with-temporary-admin-password"
  ADMIN_NAME: "Landlord Admin"
```

If you fill values in Portainer's Environment Variables table UI, enter the raw values without quote characters.

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

The workflow at `.github/workflows/docker-ghcr.yml` publishes images to:

```text
ghcr.io/yonggangg/rental
```

On pushes to `main`, it publishes:

- `latest`

GitHub Releases use version tags such as `v0.4.2`, but the container package intentionally keeps only the `latest` image tag.

## Current Status

This is an active MVP. It now includes password-protected landlord and tenant portals, core CRUD/edit pages for properties, tenants, leases, rent charges, maintenance requests, documents, and lease templates, plus map views, persistent uploads, rent automation, tenant balance summaries, multi-tenant leases, and a cleaner lease PDF pipeline. Remaining production work includes SMS provider integration, payment workflows, role-management UI, audit logs, and attorney-reviewed lease wording.

## License

No open-source license has been selected yet. Unless the repository owner adds a license later, all rights are reserved by default.
