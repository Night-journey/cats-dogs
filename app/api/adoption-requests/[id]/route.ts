import { fail, ok } from '@/lib/api';
import { pool, query } from '@/lib/db';
import { requireAdmin } from '@/lib/guards';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!['pending', 'approved', 'rejected'].includes(body.status)) return fail('Invalid status', 400);

    if (body.status !== 'approved') {
      const result = await query(
        'UPDATE adoption_requests SET status=$1, agreement_text=COALESCE($2, agreement_text), agreement_signed_at=CASE WHEN $3 THEN NOW() ELSE agreement_signed_at END WHERE id=$4 RETURNING *',
        [body.status, body.agreement_text, Boolean(body.sign_agreement), params.id]
      );
      if (!result.rowCount) return fail('Not found', 404);
      return ok(result.rows[0]);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const approved = await client.query(
        'UPDATE adoption_requests SET status=$1, agreement_text=COALESCE($2, agreement_text), agreement_signed_at=CASE WHEN $3 THEN NOW() ELSE agreement_signed_at END WHERE id=$4 RETURNING *',
        ['approved', body.agreement_text, Boolean(body.sign_agreement), params.id]
      );
      if (!approved.rowCount) {
        await client.query('ROLLBACK');
        return fail('Not found', 404);
      }

      const animalId = approved.rows[0].animal_id;
      await client.query('UPDATE animals SET adoption_status=$1 WHERE id=$2', ['adopted', animalId]);
      await client.query('UPDATE adoption_requests SET status=$1 WHERE animal_id=$2 AND id<>$3 AND status=$4', ['rejected', animalId, params.id, 'pending']);
      await client.query('COMMIT');
      return ok(approved.rows[0]);
    } catch {
      await client.query('ROLLBACK');
      return fail('Failed to update adoption status', 500);
    } finally {
      client.release();
    }
  } catch {
    return fail('Unauthorized', 401);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const result = await query('DELETE FROM adoption_requests WHERE id=$1 RETURNING id', [params.id]);
    if (!result.rowCount) return fail('Not found', 404);
    return ok({ message: 'Deleted' });
  } catch {
    return fail('Unauthorized', 401);
  }
}
