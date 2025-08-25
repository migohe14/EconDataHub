import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AgregatorService } from './agregator.service';

@Controller('agregator')
export class AgregatorController {
  constructor(private readonly agregatorService: AgregatorService) {}

  @Get('series/usa-high-yield') 
  async getusaHighYieldObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.agregatorService.getusaHighYieldObservations(sortOrder, limit);
  }

  @Get('series/euro-high-yield') 
  async geteuroHighYieldObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.agregatorService.geteuroHighYieldObservations(
      sortOrder,
      limit,
    );
  }

  @Get('series/usaTreasury')  
  async getusaTreasuryObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.agregatorService.getUsaTreasuryObservations(sortOrder, limit);
  }

  @Get('series/germanyTreasury')  
  async getGermanyTreasuryObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.agregatorService.getGermanyTreasuryObservations(sortOrder, limit);
  }
}