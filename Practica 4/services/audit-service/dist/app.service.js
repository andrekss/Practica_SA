"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const db_1 = require("./db");
let AppService = class AppService {
    async health() {
        await db_1.pool.query('SELECT 1');
        return { status: 'ok', service: 'audit-service' };
    }
    async createLog(input) {
        await db_1.pool.query(`
      INSERT INTO audit_logs(id, service, action, entity, entity_id, actor, payload)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
      `, [
            (0, uuid_1.v4)(),
            input.service,
            input.action,
            input.entity,
            input.entityId,
            input.actor,
            JSON.stringify(input.payload),
        ]);
        return { status: 'logged' };
    }
    async listLogs(query) {
        const values = [];
        const filters = [];
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
        const result = await db_1.pool.query(`
      SELECT id, service, action, entity, entity_id, actor, payload, created_at
      FROM audit_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length}
      `, values);
        return { items: result.rows };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map