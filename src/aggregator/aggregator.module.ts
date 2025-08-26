import { Module } from '@nestjs/common';
import { aggregatorController } from './aggregator.controller';
import { aggregatorService } from './aggregator.service';
import { AnalysisService } from './analysis.service'; 
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [aggregatorController],
  providers: [aggregatorService, AnalysisService]
})
export class aggregatorModule {}
