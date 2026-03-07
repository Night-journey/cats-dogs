import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const result = await query(
    `SELECT ar.*, a.name animal_name FROM adoption_requests ar
     LEFT JOIN animals a ON ar.animal_id=a.id
     ORDER BY ar.created_at DESC`
  );
  return ok(result.rows);
}

export async function POST(req: Request) {
  const auth = getAuthFromCookies();
  if (!auth) return fail('未登录或登录已过期', 401);
  const body = await req.json();
  const created = await query(
    'INSERT INTO adoption_requests(animal_id,applicant_id,applicant_name,contact,message,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [body.animal_id, auth.userId, body.applicant_name, body.contact, body.message, 'pending']
  );
  return ok(created.rows[0], 201);
}
