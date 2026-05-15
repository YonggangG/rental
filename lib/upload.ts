import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const uploadDir = process.env.UPLOAD_DIR || '/data/uploads';
function safeUploadName(name: string) {
  const safe = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!safe || safe === '.' || safe === '..') throw new Error('Invalid upload name');
  return safe;
}
export async function saveUpload(file: File) {
  await fs.mkdir(uploadDir, { recursive: true });
  const safe = safeUploadName(file.name);
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safe}`;
  const full = uploadPath(name);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(full, bytes);
  return `/api/uploads/${encodeURIComponent(name)}`;
}
export function uploadPath(name: string) {
  const root = path.resolve(/*turbopackIgnore: true*/ uploadDir);
  const full = path.resolve(root, safeUploadName(name));
  if (full.startsWith(root + path.sep)) return full;
  throw new Error('Invalid upload path');
}
