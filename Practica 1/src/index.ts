import express from 'express';
import sequelize from './db';
import solicitudesRouter from './routes/solicitudes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/solicitudes', solicitudesRouter);

async function start() {
  try {
    console.log('Conectando a la BD...');
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ ERROR REAL DETECTADO:');
    console.error(error);
    process.exit(1);
  }
}

start();
