import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'payroll',
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payrolls (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      current_step INT NOT NULL DEFAULT 1,
      uploaded_by UUID NOT NULL,
      csv_object_key TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payroll_entries (
      id UUID PRIMARY KEY,
      payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
      employee_email TEXT NOT NULL,
      employee_name TEXT NOT NULL,
      amount NUMERIC(14,2) NOT NULL,
      raw_json JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id UUID PRIMARY KEY,
      payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
      step INT NOT NULL,
      approver_user_id UUID NOT NULL,
      status TEXT NOT NULL,
      comment TEXT,
      acted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
