import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AnalysisService } from './analysis.service';
import type { MarketViewAnalysisBody } from './aggregator.model';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService,
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

  @Get('series/uk-unemployment')
  async getUkUnemploymentObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.getUkUnemploymentObservations(sortOrder, limit);
  }

  @Get('series/germany-unemployment')
  async getGermanyUnemploymentObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.getGermanyUnemploymentObservations(sortOrder, limit);
  }

  @Get('series/france-unemployment')
  async getFranceUnemploymentObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.getFranceUnemploymentObservations(sortOrder, limit);
  }

  @Get('series/spain-unemployment')
  async getSpainUnemploymentObservations(
    @Query('sort_order', new DefaultValuePipe('desc')) sortOrder: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.aggregatorService.getSpainUnemploymentObservations(sortOrder, limit);
  }

  @Post('analysis')
  async analyzeMarket(
    @Body() body: MarketViewAnalysisBody,
  ): Promise<{ report: string }> {
    const { query } = body;
    if (!query) {
      throw new BadRequestException('Analysis query is required.');
    }

    const idsToAnalyze =
      body.seriesIds && body.seriesIds.length > 0
        ? body.seriesIds
        : this.aggregatorService.getAvailableSeriesIds();

    const summaryPromises = idsToAnalyze.map(async (id) => {
      try {
        const summary = await this.aggregatorService.getSeriesSummary(id);
        return { [id.replace(/-/g, '_')]: summary };
      } catch (error) {
        this.aggregatorService.logError(
          `Could not get summary for ${id}: ${error.message}`,
          error.stack,
        );
        return null;
      }
    });

    const summariesArray = (await Promise.all(summaryPromises)).filter(
      (s) => s !== null,
    );

    if (summariesArray.length === 0) {
      throw new NotFoundException(
        'Could not retrieve data for any of the requested series.',
      );
    }

    const marketData = summariesArray.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {},
    );

    console.log(marketData);

    const analysisText = await this.analysisService.analyzeData(query, marketData);
    return { report: analysisText };
  }
}