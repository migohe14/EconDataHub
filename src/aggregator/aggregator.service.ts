import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FredSeriesObservationsResponse } from './fred-api.model';
import { SeriesSummary } from './aggregator.model';

@Injectable()
export class AggregatorService  {
  private readonly logger = new Logger(AggregatorService .name);

  private readonly apiKey: string;
  private readonly bamlSeriesId: string;
  private readonly bamlEuroSeriesId: string;
  private readonly usaTreasurySeriesId: string;
  private readonly germanyTreasurySeriesId: string;
  private readonly ukUnemploymentSeriesId: string;
  private readonly germanyUnemploymentSeriesId: string;
  private readonly franceUnemploymentSeriesId: string;
  private readonly spainUnemploymentSeriesId: string;
  private readonly franceBond10YSeriesId: string;
  private readonly italyBond10YSeriesId: string;
  private readonly spainBond10YSeriesId: string;
  private readonly ukBond10YSeriesId: string;

  private readonly fredApiUrl = 'https://api.stlouisfed.org/fred';

  private readonly seriesIdMapping: Record<string, string>;
  private readonly seriesMetadata: Record<
    string,
    { indicator: string; unit?:string; country: string }
  >;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.getConfigValue('FRED_API_KEY');
    this.bamlSeriesId = this.getConfigValue('FRED_USA_YIELD_SERIES_ID');
    this.bamlEuroSeriesId = this.getConfigValue('FRED_EURO_YIELD_SERIES_ID');
    this.usaTreasurySeriesId = this.getConfigValue('USA_TREASURY_10Y');
    this.germanyTreasurySeriesId = this.getConfigValue(
      'GERMANY_BUND_10Y',
    );
    this.ukUnemploymentSeriesId = this.getConfigValue(
      'FRED_UK_UNEMPLOYMENT_SERIES_ID',
    );
    this.germanyUnemploymentSeriesId = this.getConfigValue(
      'FRED_GERMANY_UNEMPLOYMENT_SERIES_ID',
    );
    this.franceUnemploymentSeriesId = this.getConfigValue(
      'FRED_FRANCE_UNEMPLOYMENT_SERIES_ID',
    );
    this.spainUnemploymentSeriesId = this.getConfigValue(
      'FRED_SPAIN_UNEMPLOYMENT_SERIES_ID',
    );
    this.franceBond10YSeriesId = this.getConfigValue(
      'FRED_FRANCE_BOND_10Y_SERIES_ID',
    );
    this.italyBond10YSeriesId = this.getConfigValue(
      'FRED_ITALY_BOND_10Y_SERIES_ID',
    );
    this.spainBond10YSeriesId = this.getConfigValue(
      'FRED_SPAIN_BOND_10Y_SERIES_ID',
    );
    this.ukBond10YSeriesId = this.getConfigValue('UK_BOND_10Y');

    this.seriesIdMapping = {
      'usa-high-yield': this.bamlSeriesId,
      'euro-high-yield': this.bamlEuroSeriesId,
      'usa-treasury': this.usaTreasurySeriesId,
      'germany-treasury': this.germanyTreasurySeriesId,
      'uk-unemployment': this.ukUnemploymentSeriesId,
      'germany-unemployment': this.germanyUnemploymentSeriesId,
      'france-unemployment': this.franceUnemploymentSeriesId,
      'spain-unemployment': this.spainUnemploymentSeriesId,
      'france-bond-10y': this.franceBond10YSeriesId,
      'italy-bond-10y': this.italyBond10YSeriesId,
      'spain-bond-10y': this.spainBond10YSeriesId,
      'uk-bond-10y': this.ukBond10YSeriesId,
    };

    this.seriesMetadata = {
      'usa-high-yield': { indicator: 'high_yield_spread', country: 'usa' },
      'euro-high-yield': {
        indicator: 'high_yield_spread',
        country: 'euro_area',
      },
      'usa-treasury': { indicator: '10y_treasury_yield', country: 'usa' },
      'germany-treasury': { indicator: '10y_bund_yield', country: 'germany' },
      'uk-unemployment': { indicator: 'rate_unemployment', unit: 'percentage', country: 'uk' },
      'germany-unemployment': {
        indicator: 'rate_unemployment',
        unit: 'percentage',
        country: 'germany',
      },
      'france-unemployment': {
        indicator: 'rate_unemployment',
        unit: 'percentage',
        country: 'france',
      },
      'spain-unemployment': {
        indicator: 'rate_unemployment',
        unit: 'percentage',
        country: 'spain',
      },
      'france-bond-10y': {
        indicator: '10y_bond_yield',
        unit: 'percentage',
        country: 'france',
      },
      'italy-bond-10y': {
        indicator: '10y_bond_yield',
        unit: 'percentage',
        country: 'italy',
      },
      'spain-bond-10y': {
        indicator: '10y_bond_yield',
        unit: 'percentage',
        country: 'spain',
      },
      'uk-bond-10y': {
        indicator: '10y_bond_yield',
        unit: 'percentage',
        country: 'uk',
      },
    };
  }

  async getusaHighYieldObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.bamlSeriesId, sortOrder, limit);
  }

  async geteuroHighYieldObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.bamlEuroSeriesId, sortOrder, limit);
  }

  async getUsaTreasuryObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.usaTreasurySeriesId, sortOrder, limit);
  }

  async getGermanyTreasuryObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.germanyTreasurySeriesId, sortOrder, limit);
  }

  async getUkUnemploymentObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.ukUnemploymentSeriesId, sortOrder, limit);
  }

  async getGermanyUnemploymentObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.germanyUnemploymentSeriesId, sortOrder, limit);
  }

  async getFranceUnemploymentObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.franceUnemploymentSeriesId, sortOrder, limit);
  }

  async getSpainUnemploymentObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.spainUnemploymentSeriesId, sortOrder, limit);
  }

  async getFranceBond10YObservations(
    sortOrder: string,
    limit: number,
  ): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(
      this.franceBond10YSeriesId,
      sortOrder,
      limit,
    );
  }

  async getItalyBond10YObservations(
    sortOrder: string,
    limit: number,
  ): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.italyBond10YSeriesId, sortOrder, limit);
  }

  async getSpainBond10YObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.spainBond10YSeriesId, sortOrder, limit);
  }

  async getUkBond10YObservations(sortOrder: string, limit: number): Promise<FredSeriesObservationsResponse> {
    return this.fetchFredSeriesObservations(this.ukBond10YSeriesId, sortOrder, limit);
  }

  getAvailableSeriesIds(): string[] {
    return Object.keys(this.seriesMetadata);
  }

  logError(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  async getSeriesSummary(seriesId: string): Promise<SeriesSummary> {
    const apiId = this.seriesIdMapping[seriesId];
    if (!apiId) {
      throw new NotFoundException(`Series metadata not found for id: ${seriesId}`);
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const observation_start_param = formatDate(startDate);
    const observation_end_param = formatDate(endDate);

    const data = await this.fetchFredSeriesObservations(
      apiId,
      'asc',
      undefined,
      observation_start_param,
      observation_end_param,
    );
    const { observations } = data;

    if (observations.length < 2) {
      const errorMessage = `Not enough data for series ${seriesId} to create summary for the last year.`;
      this.logger.warn(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    const previousObservation = observations[0];
    const latestObservation = observations[observations.length - 1];

    const observation_start = previousObservation.date;
    const observation_end = latestObservation.date;

    const latestValueStr = latestObservation.value;
    const previousValueStr = previousObservation.value;

    if (latestValueStr === '.' || previousValueStr === '.') {
      const errorMessage = `Invalid data points for series ${seriesId}.`;
      this.logger.warn(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
    const latest_value = parseFloat(latestValueStr);
    const previous_value = parseFloat(previousValueStr);
    const change = latest_value - previous_value;
    const change_pct =
      previous_value !== 0 ? (change / previous_value) * 100 : 0;
    const metadata = this.seriesMetadata[seriesId];

    return {
      ...metadata,
      latest_value,
      previous_value,
      change,
      change_pct,
      observation_start,
      observation_end,
    };
  }

  private getConfigValue(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`${key} is not defined`);
    }
    return value;
  }

  private async fetchFredSeriesObservations(
    seriesId: string,
    sortOrder: string,
    limit?: number, // limit is now optional and can be undefined
    observation_start?: string,
    observation_end?: string,
  ): Promise<FredSeriesObservationsResponse> {
    const url = `${this.fredApiUrl}/series/observations`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<FredSeriesObservationsResponse>(url, {
          params: {
            series_id: seriesId,
            api_key: this.apiKey,
            file_type: 'json',
            sort_order: sortOrder,
            limit,
            observation_start,
            observation_end,
          },
        }),
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch data from FRED API for series ${seriesId}:`,
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to fetch data from FRED API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}