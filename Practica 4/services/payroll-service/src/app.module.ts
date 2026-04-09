import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageService } from './storage.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, StorageService],
})
export class AppModule {}
