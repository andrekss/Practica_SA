import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProyectoModule } from './proyecto/proyecto.module';

@Module({
  imports: [ProyectoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
