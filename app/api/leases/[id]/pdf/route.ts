import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { sampleLeaseData } from '@/lib/lease-template';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = sampleLeaseData();
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 735;
  page.drawText('Florida Long-Term Residential Lease', { x: 72, y, size: 18, font: bold, color: rgb(0.05, 0.08, 0.15) });
  y -= 36;
  const lines = [
    `Lease ID: ${id}`,
    `Landlord: ${data.landlordName}`,
    `Tenant(s): ${data.tenantNames}`,
    `Premises: ${data.propertyAddress}`,
    `Term: ${data.leaseStartDate} to ${data.leaseEndDate}`,
    `Monthly Rent: $${data.monthlyRent}`,
    `Security Deposit: $${data.securityDeposit}`
  ];
  for (const line of lines) {
    page.drawText(line, { x: 72, y, size: 11, font });
    y -= 20;
  }
  y -= 12;
  page.drawText('MVP note:', { x: 72, y, size: 11, font: bold });
  y -= 18;
  page.drawText('This endpoint proves the lease PDF generation pipeline. The production version will render', { x: 72, y, size: 10, font });
  y -= 15;
  page.drawText('the full reviewed Florida lease template with database values.', { x: 72, y, size: 10, font });

  const bytes = await pdf.save();
  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="lease-${id}.pdf"`
    }
  });
}
