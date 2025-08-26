import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { aggregatorModule } from './aggregator/aggregator.module';

@Module({
  imports: [aggregatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
