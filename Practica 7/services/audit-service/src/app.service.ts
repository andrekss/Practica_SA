import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { pool } from './db';

@Injectable()
export class AppService {
  async health() {
    await pool.query('SELECT 1');
    return { status: 'ok', service: 'audit-service' };
  }

  async createLog(input: {
    service: string;
    action: string;
    entity: string;
    entityId: string;
    actor: string;
    payload: Record<string, unknown>;
  }) {
    await pool.query(
      `
      INSERT INTO audit_logs(id, service, action, entity, entity_id, actor, payload)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
      `,
      [
        uuidv4(),
        input.service,
        input.action,
        input.entity,
        input.entityId,
        input.actor,
        JSON.stringify(input.payload),
      ],
    );
    return { status: 'logged' };
  }

  async listLogs(query: {
    service?: string;
    action?: string;
    entity?: string;
    limit?: number;
  }) {
    const values: Array<string | number> = [];
    const filters: string[] = [];

    if (query.service) {
      values.push(query.service);
      filters.push(`service = $${values.length}`);
    }
    if (query.action) {
      values.push(query.action);
      filters.push(`action = $${values.length}`);
    }
    if (query.entity) {
      values.push(query.entity);
      filters.push(`entity = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const limit = Math.min(query.limit ?? 100, 500);
    values.push(limit);

    const result = await pool.query(
      `
      SELECT id, service, action, entity, entity_id, actor, payload, created_at
      FROM audit_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length}
      `,
      values,
    );
    return { items: result.rows };
  }
}
