import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return fail('Forbidden', 403);

  const result = await query('SELECT * FROM adoption_blacklist_feedback ORDER BY created_at DESC');
  return ok(result.rows);
}

export async function POST(req: Request) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const body = await req.json();
  const created = await query(
    `INSERT INTO adoption_blacklist_feedback(reporter_id,suspect_name,contact_info,reason,evidence,status)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [auth.userId, body.suspect_name, body.contact_info, body.reason, body.evidence, 'pending']
  );
  return ok(created.rows[0], 201);
}
