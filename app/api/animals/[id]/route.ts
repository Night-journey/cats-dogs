import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/guards';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const result = await query('SELECT * FROM animals WHERE id=$1', [params.id]);
  if (!result.rowCount) return fail('Not found', 404);
  return ok(result.rows[0]);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();
    const result = await query(
      `UPDATE animals SET avatar_url=$1,name=$2,species=$3,coat_color=$4,gender=$5,age=$6,neutered=$7,location=$8,active_time=$9,personality_tags=$10,description=$11,adoption_status=$12,alias=$13,feeding_guide=$14,anecdotes=$15,social_notes=$16
       WHERE id=$17 RETURNING *`,
      [
        body.avatar_url,
        body.name,
        body.species,
        body.coat_color,
        body.gender,
        body.age,
        body.neutered,
        body.location,
        body.active_time,
        body.personality_tags || [],
        body.description,
        body.adoption_status,
        body.alias || null,
        body.feeding_guide || null,
        body.anecdotes || null,
        body.social_notes || null,
        params.id
      ]
    );
    if (!result.rowCount) return fail('Not found', 404);
    return ok(result.rows[0]);
  } catch {
    return fail('Unauthorized', 401);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await query('DELETE FROM animals WHERE id=$1', [params.id]);
    return ok({ message: 'Deleted' });
  } catch {
    return fail('Unauthorized', 401);
  }
}
