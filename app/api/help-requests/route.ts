import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const result = await query('SELECT * FROM help_requests ORDER BY created_at DESC');
  return ok(result.rows);
}

export async function POST(req: Request) {
  const auth = getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);
  const body = await req.json();
  const created = await query(
    'INSERT INTO help_requests(title,description,type,location,contact_info,image_urls,status,author_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [body.title, body.description, body.type, body.location, body.contact_info, body.image_urls || [], 'open', auth.userId]
  );
  return ok(created.rows[0], 201);
}
