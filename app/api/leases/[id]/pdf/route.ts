import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '@/lib/prisma';
import { formatPropertyAddress } from '@/lib/maps';

function wrap(text: string, width = 92) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > width) { if (line) lines.push(line); line = word; }
    else line = (line + ' ' + word).trim();
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function renderTemplate(template: string, values: Record<string, string>) {
  let out = template;
  for (const [key, value] of Object.entries(values)) out = out.replaceAll(`{{${key}}}`, value);
  return out;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lease = await prisma.lease.findUnique({ where: { id }, include: { property: true, tenants: { include: { tenant: true } }, template: true } });
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([612, 792]);
  let y = 735;
  const addPage = () => { page = pdf.addPage([612, 792]); y = 735; };
  const draw = (txt: string, size = 10, b = false) => { if (y < 60) addPage(); page.drawText(txt, { x: 54, y, size, font: b ? bold : font, color: rgb(0.05, 0.08, 0.15) }); y -= size + 5; };
  const paragraph = (txt: string, size = 9) => { for (const line of wrap(txt, size >= 11 ? 76 : 96)) draw(line, size); y -= 4; };

  if (!lease) {
    draw('Florida Long-Term Residential Lease - Sample', 18, true);
    paragraph('This sample PDF proves the lease generation pipeline. Create a lease in the Landlord Portal to render real property, tenant, rent, deposit, and template values.');
  } else {
    const tenantNames = lease.tenants.map(x => `${x.tenant.firstName} ${x.tenant.lastName}`).join(', ') || 'Tenant';
    const address = formatPropertyAddress(lease.property);
    const values = {
      lease_date: new Date().toISOString().slice(0, 10), landlord_name: 'Landlord / Manager', tenant_names: tenantNames, property_address: address,
      lease_start_date: lease.startDate.toISOString().slice(0, 10), lease_end_date: lease.endDate.toISOString().slice(0, 10), monthly_rent: Number(lease.monthlyRent).toFixed(2),
      total_lease_sum: (Number(lease.monthlyRent) * 12).toFixed(2), rent_due_day: '1st', security_deposit: lease.securityDeposit ? Number(lease.securityDeposit).toFixed(2) : '0.00',
      security_deposit_bank: 'Bank designated by Landlord', repair_threshold: lease.repairThreshold ? Number(lease.repairThreshold).toFixed(2) : '170.00', tenant_repair_portion: lease.repairThreshold ? Number(lease.repairThreshold).toFixed(2) : '170.00',
      pet_allowed: lease.petFeeMonthly ? 'Yes' : 'No', pet_description: 'As approved in writing', pet_fee_monthly: lease.petFeeMonthly ? Number(lease.petFeeMonthly).toFixed(2) : '0.00', vehicle_info: 'As registered with Landlord', renter_insurance_required: 'Yes'
    };
    draw('Florida Long-Term Residential Lease', 18, true);
    paragraph(`Lease ID: ${lease.id}`);
    paragraph(`Tenant(s): ${tenantNames}`);
    paragraph(`Premises: ${address}`);
    paragraph(`Term: ${values.lease_start_date} to ${values.lease_end_date}`);
    paragraph(`Monthly Rent: $${values.monthly_rent}   Security Deposit: $${values.security_deposit}`);
    y -= 8;
    const body = renderTemplate(lease.template?.bodyMarkdown || 'Florida long-term residential lease template was not selected for this lease.', values);
    for (const raw of body.split('\n')) {
      const line = raw.trim();
      if (!line) { y -= 5; continue; }
      if (line.startsWith('#')) { draw(line.replace(/^#+\s*/, ''), line.startsWith('##') ? 12 : 14, true); }
      else if (line.startsWith('- ')) paragraph(`• ${line.slice(2)}`, 8);
      else paragraph(line, 8);
    }
  }
  y = Math.max(y, 120);
  draw('Signatures', 12, true);
  draw('Landlord Signature: ________________________________   Date: ______________', 10);
  draw('Tenant Signature: __________________________________   Date: ______________', 10);
  const bytes = await pdf.save();
  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Response(body, { headers: { 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="lease-${id}.pdf"` } });
}
