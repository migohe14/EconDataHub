import { Module } from '@nestjs/common';
import { AggregatorController } from './aggregator.controller';
import { AggregatorService } from './aggregator.service';
import { AnalysisService } from './analysis.service'; 
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AggregatorController],
  providers: [AggregatorService, AnalysisService]
})
export class AggregatorModule {}
