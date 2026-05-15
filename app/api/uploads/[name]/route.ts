import fs from 'node:fs/promises';
import { uploadPath } from '@/lib/upload';

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  try {
    const file = await fs.readFile(uploadPath(name));
    return new Response(file, { headers: { 'content-type': 'application/octet-stream', 'content-disposition': `attachment; filename="${name.replace(/"/g, '')}"` } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
