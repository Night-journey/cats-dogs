import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const species = searchParams.get('species');

  const conditions: string[] = [];
  const values: string[] = [];
  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length} OR alias ILIKE $${values.length})`);
  }
  if (species) {
    values.push(species);
    conditions.push(`species = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(`SELECT * FROM animals ${where} ORDER BY created_at DESC`, values);
  return ok(result.rows);
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) return fail('Unauthorized', 401);
    if (auth.role !== 'admin') return fail('Forbidden', 403);
    
    const body = await req.json();

    if (!body.name || !['cat', 'dog'].includes(body.species)) {
      return fail('动物名称和类型必填', 400);
    }

    const result = await query(
      `INSERT INTO animals(avatar_url,name,species,coat_color,gender,birth_date,neutered,location,active_time,personality_tags,description,adoption_status,alias,feeding_guide,anecdotes,social_notes)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [
        body.avatar_url,
        body.name,
        body.species,
        body.coat_color,
        body.gender,
        body.birth_date,
        body.neutered,
        body.location,
        body.active_time,
        body.personality_tags || [],
        body.description,
        body.adoption_status || 'campus_resident',
        body.alias || null,
        body.feeding_guide || null,
        body.anecdotes || null,
        body.social_notes || null
      ]
    );
    return ok(result.rows[0], 201);
  } catch (e) {
    console.error('POST /api/animals error:', e);
    return fail((e as Error).message || 'Server error', 500);
  }
}
