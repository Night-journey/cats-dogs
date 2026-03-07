import { fail, ok } from '@/lib/api';
import { uploadToMinio } from '@/lib/minio';
import { getAuthFromCookies } from '@/lib/auth';

const mapFolder: Record<string, string> = {
  animal: 'animal-images',
  post: 'post-images',
  help: 'help-images'
};

export async function POST(req: Request) {
  const auth = getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const kind = String(form.get('kind') || 'post');

  if (!file) return fail('File missing');
  const folder = mapFolder[kind] || 'post-images';

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const objectName = `${Date.now()}-${file.name}`;
  const url = await uploadToMinio(folder, objectName, buffer, file.type);

  return ok({ url });
}
