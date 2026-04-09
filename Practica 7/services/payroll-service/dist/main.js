"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const db_1 = require("./db");
async function bootstrap() {
    await (0, db_1.initializeDatabase)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.listen(Number(process.env.PORT ?? 3002));
}
bootstrap();
//# sourceMappingURL=main.js.map