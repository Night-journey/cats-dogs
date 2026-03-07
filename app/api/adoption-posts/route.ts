import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const where = isAdmin ? '' : "WHERE status='approved'";
  const result = await query(`SELECT * FROM adoption_posts ${where} ORDER BY created_at DESC`);
  return ok(result.rows);
}

export async function POST(req: Request) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const body = await req.json();
  const created = await query(
    `INSERT INTO adoption_posts(author_id,title,animal_name,species,health_info,description,contact_info,status)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [auth.userId, body.title, body.animal_name, body.species, body.health_info, body.description, body.contact_info, 'pending']
  );
  return ok(created.rows[0], 201);
}
