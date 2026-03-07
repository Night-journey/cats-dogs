import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/guards';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const species = searchParams.get('species');

  const conditions: string[] = [];
  const values: string[] = [];
  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
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
    requireAdmin();
    const body = await req.json();
    const result = await query(
      `INSERT INTO animals(avatar_url,name,species,coat_color,gender,age,neutered,location,active_time,personality_tags,description,adoption_status)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
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
        body.adoption_status || 'campus resident'
      ]
    );
    return ok(result.rows[0], 201);
  } catch (e) {
    return fail((e as Error).message === '无权限访问' ? '无权限访问' : '未登录或登录已过期', (e as Error).message === '无权限访问' ? 403 : 401);
  }
}
