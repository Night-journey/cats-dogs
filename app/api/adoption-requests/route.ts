import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const where = auth.role === 'admin' ? '' : 'WHERE ar.applicant_id=$1';
  const params = auth.role === 'admin' ? [] : [auth.userId];
  const result = await query(
    `SELECT ar.*, a.name animal_name FROM adoption_requests ar
     LEFT JOIN animals a ON ar.animal_id=a.id
     ${where}
     ORDER BY ar.created_at DESC`
    ,
    params
  );
  return ok(result.rows);
}

export async function POST(req: Request) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);
  const body = await req.json();

  const animal = await query('SELECT id, adoption_status FROM animals WHERE id=$1', [body.animal_id]);
  if (!animal.rowCount) return fail('Animal not found', 404);
  if (animal.rows[0].adoption_status === 'adopted') return fail('Animal already adopted', 400);

  const duplicate = await query(
    'SELECT id FROM adoption_requests WHERE animal_id=$1 AND applicant_id=$2 AND status IN (\'pending\',\'approved\')',
    [body.animal_id, auth.userId]
  );
  if (duplicate.rowCount) return fail('You already have an active request for this animal', 400);

  const created = await query(
    `INSERT INTO adoption_requests(
      animal_id,applicant_id,applicant_name,contact,message,housing_info,income_info,pet_experience,status
     ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [body.animal_id, auth.userId, body.applicant_name, body.contact, body.message, body.housing_info, body.income_info, body.pet_experience, 'pending']
  );
  return ok(created.rows[0], 201);
}
