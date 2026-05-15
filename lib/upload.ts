import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const uploadDir = process.env.UPLOAD_DIR || '/data/uploads';
export async function saveUpload(file: File) {
  await fs.mkdir(uploadDir, { recursive: true });
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safe}`;
  const full = path.join(uploadDir, name);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(full, bytes);
  return `/api/uploads/${encodeURIComponent(name)}`;
}
export function uploadPath(name: string) { return path.join(uploadDir, path.basename(name)); }
