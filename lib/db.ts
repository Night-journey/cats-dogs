import { Pool, QueryResult } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/campus_animals';

export const pool = new Pool({ connectionString });

export async function query<T = QueryResult<any>>(text: string, values: any[] = []): Promise<QueryResult<any>> {
  const result = await pool.query(text, values);
  return result;
}
