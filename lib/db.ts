import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/campus_animals';

export const pool = new Pool({ connectionString });

export async function query<T = any>(text: string, values: any[] = []) {
  const result = await pool.query<T>(text, values);
  return result;
}
