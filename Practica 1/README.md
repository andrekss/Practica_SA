# Prácticas-SA-B-202113580

## Principios SOLID

El proyecto sigue los principios SOLID para garantizar un código limpio, mantenible y escalable:

### 1. Single Responsibility Principle (SRP)
Cada módulo y clase tiene una única responsabilidad.
en el caso del modelo `SolicitudOperativa` se encarga solo de la definición y validación de la entidad, mientras que las rutas gestionan la lógica de las solicitudes HTTP.

### 2. Open-Closed Principle (OCP)
Las clases y módulos están abiertos para extensión pero cerrados para modificación. se pueden agregar nuevos endpoints e incluir ORM ya que los formateos vienen de los modelos.

### 3. Liskov Substitution Principle (LSP)
Las clases derivadas pueden sustituir a las clases base sin alterar el funcionamiento del sistema. El uso de `Model` de Sequelize permite extender funcionalidades sin romper la compatibilidad.

### 4. Interface Segregation Principle (ISP)
Las interfaces y clases no obligan a implementar métodos que no se usan. El diseño modular de rutas y modelos permite que cada parte implemente sus propias funcionalidades

### 5. Dependency Inversion Principle (DIP)
El código depende de abstracciones y no de implementaciones concretas el uso de Sequelize y Express desacopla la lógica de negocio de la infraestructura, ya qu enada depende de nada.

---

## Estructura del Proyecto

- `src/models/SolicitudOperativa.ts`: Modelo de datos y validaciones.
- `src/routes/solicitudes.ts`: Rutas para el CRUD de solicitudes operativas.
- `src/db.ts`: Configuración de la base de datos.
- `src/index.ts`: Inicialización del servidor y conexión a la base de datos.

## Instalación y Ejecución

1. Instala dependencias:
	```bash
	npm install
	```
2. Configura el archivo `.env`
3. Ejecuta el servidor en desarrollo:
	```bash
	npm run dev
	```
4. Para producción:
	```bash
	npm run build
	npm start
	```

## Uso de Docker

Incluye un archivo `docker-compose.yml` para desplegar la base de datos PostgreSQL.
