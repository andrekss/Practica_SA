import { Injectable } from '@nestjs/common';
import { pool } from './db';

@Injectable()
export class AppService {
  async health() {
    await pool.query('SELECT 1');
    return { status: 'ok', service: 'authz-service' };
  }

  async authorize(userId: string, permission: string) {
    const result = await pool.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON rp.role_id = ur.role_id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = $1 AND p.name = $2
      ) AS allowed
      `,
      [userId, permission],
    );
    return { allowed: Boolean(result.rows[0]?.allowed) };
  }

  async getUserPermissions(userId: string) {
    const result = await pool.query(
      `
      SELECT DISTINCT p.name
      FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE ur.user_id = $1
      ORDER BY p.name
      `,
      [userId],
    );
    return { userId, permissions: result.rows.map((row) => row.name) };
  }
}
