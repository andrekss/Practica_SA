"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.initializeDatabase = initializeDatabase;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'authz',
});
async function initializeDatabase() {
    await exports.pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, role_id)
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );
  `);
    await seedDefaults();
}
async function seedDefaults() {
    await exports.pool.query(`
    INSERT INTO roles(name) VALUES ('admin'), ('approver'), ('viewer')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO permissions(name) VALUES
      ('payroll:create'),
      ('payroll:read'),
      ('payroll:approve'),
      ('logs:read'),
      ('users:read')
    ON CONFLICT (name) DO NOTHING;
  `);
    await exports.pool.query(`
    INSERT INTO role_permissions(role_id, permission_id)
    SELECT r.id, p.id
    FROM roles r
    JOIN permissions p ON TRUE
    WHERE r.name = 'admin'
    ON CONFLICT DO NOTHING;
  `);
    await exports.pool.query(`
    INSERT INTO role_permissions(role_id, permission_id)
    SELECT r.id, p.id
    FROM roles r
    JOIN permissions p ON p.name IN ('payroll:read', 'payroll:approve')
    WHERE r.name = 'approver'
    ON CONFLICT DO NOTHING;
  `);
    await exports.pool.query(`
    INSERT INTO role_permissions(role_id, permission_id)
    SELECT r.id, p.id
    FROM roles r
    JOIN permissions p ON p.name IN ('payroll:read')
    WHERE r.name = 'viewer'
    ON CONFLICT DO NOTHING;
  `);
    await exports.pool.query(`
    INSERT INTO users(id, username, email)
    VALUES
      ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@empresa.com'),
      ('22222222-2222-2222-2222-222222222222', 'approver1', 'approver1@empresa.com'),
      ('33333333-3333-3333-3333-333333333333', 'viewer1', 'viewer1@empresa.com')
    ON CONFLICT (id) DO NOTHING;
  `);
    await exports.pool.query(`
    INSERT INTO user_roles(user_id, role_id)
    SELECT '11111111-1111-1111-1111-111111111111', id FROM roles WHERE name = 'admin'
    ON CONFLICT DO NOTHING;
  `);
    await exports.pool.query(`
    INSERT INTO user_roles(user_id, role_id)
    SELECT '22222222-2222-2222-2222-222222222222', id FROM roles WHERE name = 'approver'
    ON CONFLICT DO NOTHING;
  `);
    await exports.pool.query(`
    INSERT INTO user_roles(user_id, role_id)
    SELECT '33333333-3333-3333-3333-333333333333', id FROM roles WHERE name = 'viewer'
    ON CONFLICT DO NOTHING;
  `);
}
//# sourceMappingURL=db.js.map