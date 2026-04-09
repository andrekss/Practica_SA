import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'practica_db' ,
   process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    dialect: process.env.DB_DIALECT as any || 'postgres',
    logging: console.log
  }
);

export default sequelize;
