import { Module } from '@nestjs/common';
import { AgregatorController } from './agregator.controller';
import { AgregatorService } from './agregator.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AgregatorController],
  providers: [AgregatorService]
})
export class AgregatorModule {}
