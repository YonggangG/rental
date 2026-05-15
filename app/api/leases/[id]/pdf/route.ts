import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '@/lib/prisma';
import { formatPropertyAddress } from '@/lib/maps';

function fillTemplate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((body, [key, value]) => body.replaceAll(`{{${key}}}`, value), template);
}

function cleanLine(line: string) {
  return line.replace(/\{\{[^}]+\}\}/g, '').replace(/\s+/g, ' ').trim();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lease = await prisma.lease.findUnique({
    where: { id },
    include: { property: true, tenants: { include: { tenant: true } }, template: true }
  });
  const defaultTemplate = lease?.template ? null : await prisma.leaseTemplate.findFirst({ where: { active: true }, orderBy: { createdAt: 'asc' } });

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const pageSize: [number, number] = [612, 792];
  const margin = 54;
  const maxWidth = pageSize[0] - margin * 2;
  let page = pdf.addPage(pageSize);
  let y = 730;

  function addPage() {
    page = pdf.addPage(pageSize);
    y = 730;
  }
  function textWidth(text: string, size: number, isBold = false) {
    return (isBold ? bold : font).widthOfTextAtSize(text, size);
  }
  function linesFor(text: string, size: number, isBold = false) {
    const words = cleanLine(text).split(' ').filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const next = current ? current + ' ' + word : word;
      if (textWidth(next, size, isBold) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else current = next;
    }
    if (current) lines.push(current);
    return lines.length ? lines : [''];
  }
  function drawLine(text: string, size = 10, isBold = false, gap = 4) {
    if (y < 72) addPage();
    page.drawText(text, { x: margin, y, size, font: isBold ? bold : font, color: rgb(0.05, 0.06, 0.08) });
    y -= size + gap;
  }
  function paragraph(text: string, size = 10, isBold = false) {
    for (const line of linesFor(text, size, isBold)) drawLine(line, size, isBold, 3);
    y -= 5;
  }
  function rule() {
    if (y < 80) addPage();
    page.drawLine({ start: { x: margin, y }, end: { x: pageSize[0] - margin, y }, thickness: 0.5, color: rgb(0.72, 0.75, 0.8) });
    y -= 14;
  }

  const title = 'Florida Long-Term Residential Lease';
  drawLine(title, 18, true, 8);
  rule();

  if (!lease) {
    paragraph('Sample lease PDF. Create a lease in the Landlord Portal to render real property, tenant, rent, deposit, and template values.');
  } else {
    const tenantNames = lease.tenants.map(x => `${x.tenant.firstName} ${x.tenant.lastName}`).join(', ') || 'Tenant';
    const address = formatPropertyAddress(lease.property);
    const rentDueDay = String(lease.rentDueDay || lease.property.rentDueDay || 1);
    const values = {
      lease_date: new Date().toISOString().slice(0, 10),
      landlord_name: 'Landlord / Manager',
      tenant_names: tenantNames,
      property_address: address,
      lease_start_date: lease.startDate.toISOString().slice(0, 10),
      lease_end_date: lease.endDate.toISOString().slice(0, 10),
      monthly_rent: Number(lease.monthlyRent).toFixed(2),
      total_lease_sum: (Number(lease.monthlyRent) * 12).toFixed(2),
      rent_due_day: rentDueDay,
      security_deposit: lease.securityDeposit ? Number(lease.securityDeposit).toFixed(2) : '0.00',
      security_deposit_bank: 'Bank designated by Landlord',
      repair_threshold: lease.repairThreshold ? Number(lease.repairThreshold).toFixed(2) : '170.00',
      tenant_repair_portion: lease.repairThreshold ? Number(lease.repairThreshold).toFixed(2) : '170.00',
      pet_allowed: lease.petFeeMonthly ? 'Yes' : 'No',
      pet_description: 'As approved in writing',
      pet_fee_monthly: lease.petFeeMonthly ? Number(lease.petFeeMonthly).toFixed(2) : '0.00',
      vehicle_info: 'As registered with Landlord',
      renter_insurance_required: 'Yes'
    };

    paragraph(`Lease ID: ${lease.id}`, 10, true);
    paragraph(`Tenant(s): ${tenantNames}`);
    paragraph(`Premises: ${address}`);
    paragraph(`Term: ${values.lease_start_date} to ${values.lease_end_date}`);
    paragraph(`Monthly Rent: $${values.monthly_rent}    Due Day: ${rentDueDay}    Security Deposit: $${values.security_deposit}`);
    rule();

    const template = lease.template?.bodyMarkdown || defaultTemplate?.bodyMarkdown || [
      '# Lease Terms',
      'Landlord leases the premises to Tenant for the term and rent stated above.',
      'Tenant shall pay monthly rent on the due day stated above.',
      'Tenant shall keep the premises clean, safe, and in good condition, subject to ordinary wear and tear.',
      'All other terms are governed by the signed lease record and applicable Florida law.'
    ].join('\n\n');
    const body = fillTemplate(template, values).replace(/<!--([\s\S]*?)-->/g, '');
    let renderingStarted = false;
    for (const raw of body.split('\n')) {
      if (!renderingStarted) {
        if (/^#\s+RESIDENTIAL LEASE/i.test(raw.trim())) renderingStarted = true;
        else continue;
      }
      const line = cleanLine(raw.replace(/^[-*]\s+/, '• '));
      if (!line) { y -= 5; continue; }
      if (/^IN WITNESS WHEREOF/i.test(line) || /^Clean Signature \/ Witness Fields/i.test(line) || /^\[signature\]/i.test(line)) break;
      if (/^#{1,6}\s/.test(raw)) paragraph(line.replace(/^#+\s*/, ''), 12, true);
      else if (/^ARTICLE\s+[IVXLCDM]+/i.test(line)) paragraph(line, 11, true);
      else paragraph(line, 9);
    }
  }

  if (y < 260) addPage();
  y -= 8;
  drawLine('Signatures', 13, true, 10);
  const sigRows = lease?.tenants.map((x, i) => `Tenant ${i + 1}: ${x.tenant.firstName} ${x.tenant.lastName}`) || ['Tenant'];
  const signers = ['Landlord / Manager', ...sigRows];
  for (const signer of signers) {
    if (y < 120) addPage();
    drawLine(signer, 10, true, 8);
    drawLine('Signature: ________________________________________________    Date: ________________', 10, false, 10);
    drawLine('Printed Name: _____________________________________________', 10, false, 12);
  }
  drawLine('Witness 1: ________________________________    Witness 2: ________________________________', 9, false, 8);

  const bytes = await pdf.save();
  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Response(body, { headers: { 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="lease-${id}.pdf"` } });
}
