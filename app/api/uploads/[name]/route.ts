import fs from 'node:fs/promises';
import { uploadPath } from '@/lib/upload';

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const file = await fs.readFile(uploadPath(name));
  return new Response(file, { headers: { 'content-type': 'application/octet-stream', 'content-disposition': `inline; filename="${name}"` } });
}
