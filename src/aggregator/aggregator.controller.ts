import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { aggregatorService } from './aggregator.service';
import { AnalysisService } from './analysis.service';

interface AnalysisRequestBody {
  query: string;
}

@Controller('aggregator')
export class aggregatorController {
  constructor(private readonly aggregatorService: aggregatorService,
    private readonly analysisService: AnalysisService) {}

  @Get('series/usa-high-yield') 
  async getusaHighYieldObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.getusaHighYieldObservations(sortOrder, limit);
  }

  @Get('series/euro-high-yield') 
  async geteuroHighYieldObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.geteuroHighYieldObservations(
      sortOrder,
      limit,
    );
  }

  @Get('series/usa-treasury')  
  async getusaTreasuryObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.getUsaTreasuryObservations(sortOrder, limit);
  }

  @Get('series/germany-treasury')  
  async getGermanyTreasuryObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.getGermanyTreasuryObservations(sortOrder, limit);
  }

  @Post('analysis/:seriesId')
  async analyzeSeries(
    @Param('seriesId') seriesId: string,
    @Body() body: AnalysisRequestBody,
  ) {
    const { query } = body;
    if (!query) {
      throw new NotFoundException('Analysis query is required.');
    }

    let data;
    // Usamos un switch para obtener los datos de la serie correcta.
    // Podríamos usar una estrategia más avanzada (como un mapa) si las series crecen.
    switch (seriesId) {
      case 'usa-high-yield':
        data = await this.aggregatorService.getusaHighYieldObservations('desc', 100); // Obtenemos más datos para un mejor análisis
        break;
      case 'euro-high-yield':
        data = await this.aggregatorService.geteuroHighYieldObservations('desc', 100);
        break;
      case 'usa-treasury':
        data = await this.aggregatorService.getUsaTreasuryObservations('desc', 100);
        break;
      case 'germany-treasury':
        data = await this.aggregatorService.getGermanyTreasuryObservations('desc', 100);
        break;
      default:
        throw new NotFoundException(`Series with id "${seriesId}" not found.`);
    }

    return this.analysisService.analyzeData(query, data.observations);
  }
}