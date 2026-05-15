'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { saveUpload } from '@/lib/upload';
const s=(fd:FormData,k:string)=>String(fd.get(k)||'').trim();
export async function submitTenantMaintenance(fd:FormData){const user=await requireUser();const lang=s(fd,'lang')||'en';if(!user.tenant)redirect(`/tenant/maintenance?lang=${lang}`);const lease=await prisma.leaseTenant.findFirst({where:{tenantId:user.tenant.id},include:{lease:true}});if(!lease)redirect(`/tenant/maintenance?lang=${lang}`);await prisma.maintenanceRequest.create({data:{propertyId:lease.lease.propertyId,tenantId:user.tenant.id,title:s(fd,'title'),description:s(fd,'description'),priority:s(fd,'priority')||'normal',status:'OPEN'}});revalidatePath('/tenant/maintenance');redirect(`/tenant/maintenance?lang=${lang}`)}
export async function uploadTenantDocument(fd:FormData){const user=await requireUser();const lang=s(fd,'lang')||'en';if(!user.tenant)redirect(`/tenant/documents?lang=${lang}`);const file=fd.get('file');let path=s(fd,'path');if(file instanceof File && file.size>0){path=await saveUpload(file)}if(!path)redirect(`/tenant/documents?lang=${lang}`);await prisma.document.create({data:{tenantId:user.tenant.id,title:s(fd,'title')|| (file instanceof File ? file.name : 'Document'),kind:s(fd,'kind')||'tenant-upload',path}});revalidatePath('/tenant/documents');redirect(`/tenant/documents?lang=${lang}`)}
