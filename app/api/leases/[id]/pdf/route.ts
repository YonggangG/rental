import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '@/lib/prisma';
import { formatPropertyAddress } from '@/lib/maps';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lease = await prisma.lease.findUnique({ where: { id }, include: { property: true, tenants: { include: { tenant: true } }, template: true } });
  const pdf = await PDFDocument.create(); const page = pdf.addPage([612, 792]); const font = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let y = 735; const line=(txt:string,size=11,b=false)=>{ page.drawText(txt.slice(0,110),{x:72,y,size,font:b?bold:font,color:rgb(0.05,0.08,0.15)}); y-=18; };
  line('Florida Long-Term Residential Lease',18,true); y-=12;
  if (!lease) { line(`Sample Lease ID: ${id}`); line('This sample proves the PDF generation pipeline.'); }
  else { const tenants=lease.tenants.map(x=>`${x.tenant.firstName} ${x.tenant.lastName}`).join(', ') || 'Tenant'; line(`Lease ID: ${lease.id}`); line(`Landlord: Landlord / Manager`); line(`Tenant(s): ${tenants}`); line(`Premises: ${formatPropertyAddress(lease.property)}`); line(`Term: ${lease.startDate.toISOString().slice(0,10)} to ${lease.endDate.toISOString().slice(0,10)}`); line(`Monthly Rent: $${Number(lease.monthlyRent).toFixed(2)}`); line(`Security Deposit: $${lease.securityDeposit ? Number(lease.securityDeposit).toFixed(2) : "0.00"}`); y-=10; line('Lease Template Summary',13,true); const body=(lease.template?.bodyMarkdown||'Florida long-term residential lease template.').split('\n').filter(Boolean).slice(0,22); for (const b of body) line(b.replace(/^#+\s*/, ''), 9); }
  y = Math.max(y, 90); page.drawText('Landlord Signature: ____________________   Date: __________',{x:72,y,size:10,font}); y-=24; page.drawText('Tenant Signature: ______________________   Date: __________',{x:72,y,size:10,font});
  const bytes = await pdf.save(); const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Response(body, { headers: { 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="lease-${id}.pdf"` } });
}
