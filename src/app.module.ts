import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgregatorModule } from './agregator/agregator.module';

@Module({
  imports: [AgregatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
