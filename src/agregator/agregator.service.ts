import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AgregatorService {
  private readonly logger = new Logger(AgregatorService.name);
  private readonly apiKey: string;
  private readonly bamlSeriesId: string;
  private readonly bamlEuroSeriesId: string;
  private readonly usaTreasurySeriesId: string;
  private readonly germanyTreasurySeriesId: string;
  
  private readonly fredApiUrl = 'https://api.stlouisfed.org/fred';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('FRED_API_KEY');
    if (!apiKey) {
      throw new Error('FRED_API_KEY is not defined');
    }
    this.apiKey = apiKey;

    const bamlSeriesId = this.configService.get<string>(
      'FRED_USA_YIELD_SERIES_ID',
    );
    if (!bamlSeriesId) {
      throw new Error('FRED_USA_YIELD_SERIES_ID is not defined');
    }
    this.bamlSeriesId = bamlSeriesId;

    const bamlEuroSeriesId = this.configService.get<string>(
      'FRED_EURO_YIELD_SERIES_ID', 
    );
    if (!bamlEuroSeriesId) {
      throw new Error('FRED_EURO_YIELD_SERIES_ID is not defined');
    }
    this.bamlEuroSeriesId = bamlEuroSeriesId;

    const usaTreasurySeriesId = this.configService.get<string>(
      'FRED_USATREASURY_SERIES_ID',
    );
    if (!usaTreasurySeriesId) {
      throw new Error('FRED_USATREASURY_SERIES_IDD is not defined');
    }
    this.usaTreasurySeriesId = usaTreasurySeriesId;

    const germanyTreasurySeriesId = this.configService.get<string>(
      'FRED_GERMANY_YIELD_SERIES_ID',
    );
    if (!germanyTreasurySeriesId) {
      throw new Error('FRED_GERMANY_YIELD_SERIES_ID is not defined');
    }
    this.germanyTreasurySeriesId = germanyTreasurySeriesId;
  }

  async getusaHighYieldObservations(sortOrder: string, limit: number) {
    return this.fetchFredSeriesObservations(this.bamlSeriesId, sortOrder, limit);
  }

  async geteuroHighYieldObservations(sortOrder: string, limit: number) {
    return this.fetchFredSeriesObservations(
      this.bamlEuroSeriesId,
      sortOrder,
      limit,
    );
  }

  async getUsaTreasuryObservations(sortOrder: string, limit: number) {
    return this.fetchFredSeriesObservations(this.usaTreasurySeriesId, sortOrder, limit);
  }

  async getGermanyTreasuryObservations(sortOrder: string, limit: number) {
    return this.fetchFredSeriesObservations(this.germanyTreasurySeriesId, sortOrder, limit);
  }

  /**
   * Fetches observations for a given series from the FRED API.
   * This is kept private for internal use by more specific methods.
   * @private
   * @param seriesId The ID of the series to fetch.
   * @param sortOrder The sort order for the results.
   * @param limit The maximum number of results to return.
   */
  private async fetchFredSeriesObservations(
    seriesId: string,
    sortOrder: string,
    limit: number,
  ) {
    const url = `${this.fredApiUrl}/series/observations`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            series_id: seriesId,
            api_key: this.apiKey,
            file_type: 'json',
            sort_order: sortOrder,
            limit,
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
